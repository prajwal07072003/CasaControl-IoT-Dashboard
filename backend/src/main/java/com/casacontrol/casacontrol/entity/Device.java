package com.casacontrol.casacontrol.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "devices")
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;        // e.g., "Light 1"
    private String topic;       // e.g., "/home/livingroom/light1"
    private boolean status;     // ON or OFF

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;          // optional, if each user has their own devices
}
