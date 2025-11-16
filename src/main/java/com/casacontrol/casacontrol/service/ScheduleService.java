package com.casacontrol.casacontrol.service;

import com.casacontrol.casacontrol.dto.ScheduleCreateRequest;
import com.casacontrol.casacontrol.entity.Device;
import com.casacontrol.casacontrol.entity.Schedule;
import com.casacontrol.casacontrol.entity.ScheduleAction;
import com.casacontrol.casacontrol.repository.DeviceRepository;
import com.casacontrol.casacontrol.repository.ScheduleRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Locale;

@Service
public class ScheduleService {

    private final ScheduleRepository scheduleRepo;
    private final DeviceRepository deviceRepo;
    private final MqttPublisherService mqtt;

    public ScheduleService(ScheduleRepository scheduleRepo,
                           DeviceRepository deviceRepo,
                           MqttPublisherService mqtt) {
        this.scheduleRepo = scheduleRepo;
        this.deviceRepo = deviceRepo;
        this.mqtt = mqtt;
    }

    public Schedule create(ScheduleCreateRequest req) {
        Schedule s = new Schedule();
        s.setName(req.name);
        s.setTime(req.time);
        s.setRepeatDays(String.join(",", req.repeatDays));
        s.setEnabled(req.enabled != null ? req.enabled : true);

        // attach actions
        for (ScheduleCreateRequest.Action a : req.actions) {
            ScheduleAction sa = new ScheduleAction();
            sa.setDeviceId(a.deviceId);
            sa.setAction(a.action);
            sa.setSchedule(s);
            s.getActions().add(sa);
        }
        return scheduleRepo.save(s);
    }

    public boolean shouldRunNow(Schedule s, LocalDateTime now) {
        if (!s.isEnabled()) return false;

        // match time HH:mm
        String hhmm = String.format("%02d:%02d", now.getHour(), now.getMinute());
        if (!hhmm.equals(s.getTime())) return false;

        // match day
        String rep = s.getRepeatDays();
        if (rep == null || rep.isEmpty()) return false;
        if (rep.equalsIgnoreCase("ONCE")) return true;

        DayOfWeek dow = now.getDayOfWeek();
        String tag = dow.name().substring(0,3); // MON/TUE/...
        for (String x : rep.split(",")) {
            if (x.trim().toUpperCase(Locale.ROOT).equals(tag)) return true;
        }
        return false;
    }

    @Scheduled(cron = "0 * * * * *") // every minute at second 0
    public void tick() {
        var now = LocalDateTime.now();
        var all = scheduleRepo.findAll();
        for (Schedule s : all) {
            if (!shouldRunNow(s, now)) continue;

            // execute actions
            for (var a : s.getActions()) {
                Device d = deviceRepo.findById(a.getDeviceId()).orElse(null);
                if (d == null) continue;

                String msg = "ON".equalsIgnoreCase(a.getAction()) ? "ON" : "OFF";
                mqtt.publish(d.getTopic(), msg);
                d.setStatus("ON".equalsIgnoreCase(msg));
                deviceRepo.save(d);
            }

            // if ONCE, disable after run
            if (s.getRepeatDays().equalsIgnoreCase("ONCE")) {
                s.setEnabled(false);
                scheduleRepo.save(s);
            }
        }
    }
}
