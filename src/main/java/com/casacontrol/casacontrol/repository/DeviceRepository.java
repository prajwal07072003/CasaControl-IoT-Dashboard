package com.casacontrol.casacontrol.repository;

import com.casacontrol.casacontrol.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeviceRepository extends JpaRepository<Device, Long> {
    Device findByTopic(String topic);
}
