package com.example.backend.dto;

public class NotificationsDTO {

    private String senderId;
    private String fullName;
    private String message;
    private int count;

    public NotificationsDTO(String senderId, String fullName, String message, int count) {
        this.senderId = senderId;
        this.fullName = fullName;
        this.message = message;
        this.count = count;
    }

    public String getSenderId() { return senderId; }
    public String getFullName() { return fullName; }
    public String getMessage() { return message; }
    public int getCount() { return count; }
}

