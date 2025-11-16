package com.casacontrol.casacontrol.dto;

import java.util.List;

public class ScheduleCreateRequest {
    public String name;
    public String time;               // "HH:mm"
    public List<String> repeatDays;   // ["MON","TUE"] or ["ONCE"]
    public Boolean enabled;
    public List<Action> actions;      // [{deviceId, action}]

    public static class Action {
        public Long deviceId;
        public String action; // "ON"/"OFF"
    }
}
