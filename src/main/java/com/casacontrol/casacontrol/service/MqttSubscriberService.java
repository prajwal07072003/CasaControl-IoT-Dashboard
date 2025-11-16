package com.casacontrol.casacontrol.service;

import com.casacontrol.casacontrol.entity.Device;
import com.casacontrol.casacontrol.repository.DeviceRepository;
import jakarta.annotation.PostConstruct;
import org.eclipse.paho.client.mqttv3.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MqttSubscriberService implements MqttCallback {

    @Autowired
    private MqttClient mqttClient;

    @Autowired
    private DeviceRepository deviceRepository;

    @PostConstruct
    public void init() {
        try {
            mqttClient.setCallback(this);
            mqttClient.subscribe("/home/+/+/status"); // Subscribe to all status topics
            System.out.println("📡 Subscribed to device status updates!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void connectionLost(Throwable cause) {
        System.out.println("❌ MQTT Connection lost: " + cause.getMessage());
    }

    @Override
    public void messageArrived(String topic, MqttMessage message) {
        String payload = new String(message.getPayload());
        System.out.println("📥 Received from " + topic + " → " + payload);

        try {
            // 🧠 Remove "/status" to match base topic stored in DB
            String baseTopic = topic.replace("/status", "");
            Device device = deviceRepository.findByTopic(baseTopic);

            if (device != null) {
                boolean newStatus = payload.equalsIgnoreCase("ON");
                device.setStatus(newStatus);
                deviceRepository.save(device);
                System.out.println("✅ Updated " + device.getName() + " → " + payload);
            } else {
                System.out.println("⚠️ No matching device found for topic: " + topic);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void deliveryComplete(IMqttDeliveryToken token) {}
}
