package com.casacontrol.casacontrol.controller;

import com.casacontrol.casacontrol.entity.Device;
import com.casacontrol.casacontrol.repository.DeviceRepository;
import com.casacontrol.casacontrol.service.MqttPublisherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/devices")     // ✅ FIXED — API PREFIX ADDED
@CrossOrigin("*")
public class DeviceController {

    @Autowired
    private MqttPublisherService mqttPublisherService;

    @Autowired
    private DeviceRepository deviceRepository;

    // ✅ Get all devices
    @GetMapping
    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }

    // ✅ Add Device (auto topic)
    @PostMapping("/add")
    public Device addDevice(@RequestBody Device device) {

        if (device.getName() == null || device.getName().isEmpty()) {
            throw new RuntimeException("Device name is required");
        }

        device.setStatus(false);

        String room = (device.getRoom() != null && !device.getRoom().isEmpty())
                ? device.getRoom().toLowerCase().replace(" ", "_")
                : "default";

        String safeName = device.getName().toLowerCase().replace(" ", "_");

        if (device.getTopic() == null || device.getTopic().isEmpty()) {
            device.setTopic("/home/" + room + "/" + safeName);
        }

        return deviceRepository.save(device);
    }

    // ✅ Get device by ID
    @GetMapping("/{id}")
    public Device getDeviceById(@PathVariable Long id) {
        return deviceRepository.findById(id).orElse(null);
    }

    // ✅ Toggle a single device
    @PostMapping("/toggle/{id}")
    public String toggleDevice(@PathVariable Long id, @RequestParam boolean state) {

        Device device = deviceRepository.findById(id).orElse(null);
        if (device == null) return "Device not found";

        String message = state ? "ON" : "OFF";
        mqttPublisherService.publish(device.getTopic(), message);

        device.setStatus(state);
        deviceRepository.save(device);

        return "Device " + device.getName() + " turned " + message;
    }

    // ✅ Toggle all devices
    @PostMapping("/toggle-all")
    public String toggleAll(@RequestParam boolean state) {

        List<Device> devices = deviceRepository.findAll();
        String message = state ? "ON" : "OFF";

        for (Device d : devices) {
            mqttPublisherService.publish(d.getTopic(), message);
            d.setStatus(state);
        }

        deviceRepository.saveAll(devices);
        return "All devices turned " + message;
    }

    // ✅ Delete device
    @DeleteMapping("/{id}")
    public String deleteDevice(@PathVariable Long id) {

        if (!deviceRepository.existsById(id)) {
            return "Device not found";
        }

        deviceRepository.deleteById(id);
        return "Deleted";
    }

    // ✅ Brightness (0–100)
    @PostMapping("/{id}/brightness")
    public String brightness(@PathVariable Long id, @RequestParam int value) {
        Device d = deviceRepository.findById(id).orElse(null);
        if (d == null) return "Device not found";

        mqttPublisherService.publish(d.getTopic() + "/brightness", String.valueOf(value));
        return "Brightness updated";
    }

    // ✅ Fan speed (1–5)
    @PostMapping("/{id}/speed")
    public String fanSpeed(@PathVariable Long id, @RequestParam int level) {
        Device d = deviceRepository.findById(id).orElse(null);
        if (d == null) return "Device not found";

        mqttPublisherService.publish(d.getTopic() + "/speed", String.valueOf(level));
        return "Fan speed updated";
    }

    // ✅ AC temperature (16–30)
    @PostMapping("/{id}/temperature")
    public String temperature(@PathVariable Long id, @RequestParam int temp) {
        Device d = deviceRepository.findById(id).orElse(null);
        if (d == null) return "Device not found";

        mqttPublisherService.publish(d.getTopic() + "/temp", String.valueOf(temp));
        return "Temperature updated";
    }
}
