package com.example.backend.controller;

import com.example.backend.dto.ConversationDTO;
import com.example.backend.dto.ReadReceiptDTO;
import com.example.backend.model.Message;
import com.example.backend.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin
public class MessageController {
    @Autowired
    private MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/{senderId}/{receiverId}")
    public List<Message> getMessages(@PathVariable String senderId, @PathVariable String receiverId) {
        return messageService.getChatMessages(senderId, receiverId);}

    @PostMapping("/send")
    public Message sendMessage(@RequestBody Message message) {
        return messageService.saveMessage(message);
    }

    @GetMapping("/history")
    public List<Message> getChatHistory(@RequestParam String userId1, @RequestParam String userId2) {
        return messageService.getChatHistory(userId1, userId2);
    }

    @GetMapping("/conversations/{userId}")
    public List<ConversationDTO> getConversations(@PathVariable String userId) {
        return messageService.getUserConversations(userId);
    }

    @PostMapping("/read")
    public void markAsRead(@RequestBody ReadReceiptDTO dto) {
        messageService.markMessagesAsRead(
                dto.senderId(),
                dto.receiverId()
        );
    }
}
