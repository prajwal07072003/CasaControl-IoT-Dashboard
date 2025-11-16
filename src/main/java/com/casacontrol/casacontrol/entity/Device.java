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

    private String name;     // e.g., "Living Light 1"

    @Column(unique = true)
    private String topic;    // e.g., "home/living/light1"

    private String room;     // e.g., "Living Room", "Bedroom", "Kitchen"

    private String type;     // e.g., "LIGHT", "FAN", "AC", "TV", "HEATER", "FRIDGE"

    private boolean status;  // true = ON, false = OFF

    // OPTIONAL (keep only if needed)
    // Each device belongs to a user
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
