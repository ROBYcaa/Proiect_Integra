package com.example.backend.controller;

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
}
