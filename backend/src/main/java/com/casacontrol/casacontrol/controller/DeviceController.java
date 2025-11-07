package com.casacontrol.casacontrol.controller;

import com.casacontrol.casacontrol.entity.Device;
import com.casacontrol.casacontrol.repository.DeviceRepository;
import com.casacontrol.casacontrol.service.MqttPublisherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/devices")
@CrossOrigin("*")
public class DeviceController {

    @Autowired
    private MqttPublisherService mqttPublisherService;

    @Autowired
    private DeviceRepository deviceRepository;

    // ✅ Toggle a device ON/OFF
    @PostMapping("/toggle/{device}")
    public String toggleDevice(@PathVariable String device, @RequestParam boolean state) {
        String topic = "/home/livingroom/" + device;
        String message = state ? "ON" : "OFF";
        mqttPublisherService.publish(topic, message);
        return "Device " + device + " set to " + message;
    }

    // ✅ Toggle ALL devices at once
    @PostMapping("/toggle-all")
    public String toggleAllDevices(@RequestParam boolean state) {
        List<Device> devices = deviceRepository.findAll();
        String message = state ? "ON" : "OFF";

        for (Device device : devices) {
            mqttPublisherService.publish(device.getTopic(), message);
        }

        return "All devices set to " + message;
    }

    // ✅ Get all devices
    @GetMapping
    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }

    // ✅ Add a new device
    @PostMapping("/add")
    public Device addDevice(@RequestBody Device device) {
        return deviceRepository.save(device);
    }

    // ✅ Get a device by ID
    @GetMapping("/{id}")
    public Device getDeviceById(@PathVariable Long id) {
        return deviceRepository.findById(id).orElse(null);
    }
}
