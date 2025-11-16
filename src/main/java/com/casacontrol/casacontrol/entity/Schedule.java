package com.casacontrol.casacontrol.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Getter @Setter @NoArgsConstructor
@Table(name = "schedules")
public class Schedule {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;        // e.g., "Evening routine"
    private String time;        // "HH:mm" -> 18:30
    private String repeatDays;  // CSV of MON,TUE,WED... or "ONCE"
    private boolean enabled = true;

    // optional advanced fields (future: sunrise/sunset support)
    private String sunEvent;     // "SUNRISE" | "SUNSET" | null
    private Integer offsetMinutes; // +/- offset minutes from sunEvent

    @JsonManagedReference
    @OneToMany(mappedBy = "schedule", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<ScheduleAction> actions = new ArrayList<>();
}
