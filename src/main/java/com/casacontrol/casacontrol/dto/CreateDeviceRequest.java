package com.casacontrol.casacontrol.dto;

public class CreateDeviceRequest {
    private String name;
    private String room;
    private String type;

    public String getName() { return name; }
    public String getRoom() { return room; }
    public String getType() { return type; }

    public void setName(String name) { this.name = name; }
    public void setRoom(String room) { this.room = room; }
    public void setType(String type) { this.type = type; }
}
