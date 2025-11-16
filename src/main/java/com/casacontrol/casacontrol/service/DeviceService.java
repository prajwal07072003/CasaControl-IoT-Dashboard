package com.casacontrol.casacontrol.service;

import com.casacontrol.casacontrol.dto.CreateDeviceRequest;
import com.casacontrol.casacontrol.entity.Device;
import com.casacontrol.casacontrol.repository.DeviceRepository;
import org.springframework.stereotype.Service;

@Service
public class DeviceService {

    private final DeviceRepository repo;

    public DeviceService(DeviceRepository repo) {
        this.repo = repo;
    }

    // ✅ Auto-generate topic based on room + type
    private String generateTopic(String room, String type) {
        String base = "home/" +
                room.toLowerCase().replace(" ", "") + "/" +
                type.toLowerCase();

        long count = repo.count();  // could also count by room/type
        return base + (count + 1); // e.g. home/livingroom/light3
    }

    public Device create(CreateDeviceRequest req) {
        Device d = new Device();
        d.setName(req.getName());
        d.setRoom(req.getRoom());
        d.setType(req.getType());
        d.setStatus(false);

        // ✅ Auto-generate MQTT topic
        d.setTopic(generateTopic(req.getRoom(), req.getType()));

        return repo.save(d);
    }
}
