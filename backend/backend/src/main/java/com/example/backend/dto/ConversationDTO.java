package com.example.backend.dto;

import java.time.LocalDateTime;

public class ConversationDTO {

    private String conversationUserId;
    private String fullName;
    private String lastMessage;
    private LocalDateTime timestamp;
    private Boolean read;

    public ConversationDTO() {}

    public ConversationDTO(String conversationUserId, String fullName, String lastMessage, LocalDateTime timestamp, Boolean read) {
        this.conversationUserId = conversationUserId;
        this.fullName = fullName;
        this.lastMessage = lastMessage;
        this.timestamp = timestamp;
        this.read = read;
    }

    public String getConversationUserId() {
        return conversationUserId;
    }

    public String getFullName() {
        return fullName;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public Boolean getRead() {
        return read;
    }
}
