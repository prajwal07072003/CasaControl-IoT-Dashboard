package com.casacontrol.casacontrol.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter @NoArgsConstructor
@Table(name = "schedule_actions")
public class ScheduleAction {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long deviceId;       // Device to control
    private String action;       // "ON" or "OFF"
    
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id")
    private Schedule schedule;
}
