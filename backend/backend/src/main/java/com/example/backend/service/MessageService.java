package com.example.backend.service;

import com.example.backend.dto.ConversationDTO;
import com.example.backend.dto.ReadReceiptDTO;
import com.example.backend.model.Message;
import com.example.backend.repository.MessageRepository;
import com.example.backend.repository.UserDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.backend.model.UserDetail;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.*;
import java.time.LocalDateTime;

@Service
public class MessageService {

    @Autowired
    private final MessageRepository messageRepository;
    private final UserDetailRepository userDetailRepository;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public MessageService(MessageRepository messageRepository,
                          UserDetailRepository userDetailRepository) {
        this.messageRepository = messageRepository;
        this.userDetailRepository = userDetailRepository;
    }

    public List<ConversationDTO> getUserConversations(String userId) {

        List<Message> messages =
                messageRepository.findBySenderIdOrReceiverIdOrderByTimestampDesc(userId, userId);

        Map<String, Message> conversationMap = new LinkedHashMap<>();

        for (Message message : messages) {
            String otherUserId =
                    message.getSenderId().equals(userId)
                            ? message.getReceiverId()
                            : message.getSenderId();

            conversationMap.putIfAbsent(otherUserId, message);
        }

        List<ConversationDTO> conversations = new ArrayList<>();

        for (Map.Entry<String, Message> entry : conversationMap.entrySet()) {
            String otherUserId = entry.getKey();
            Message lastMessage = entry.getValue();

            Optional<UserDetail> userDetail =
                    userDetailRepository.findByUserId(otherUserId);

            String fullName = userDetail
                    .map(u -> u.getFirstName() + " " + u.getLastName())
                    .orElse("Unknown User");

            conversations.add(
                    new ConversationDTO(
                            otherUserId,
                            fullName,
                            lastMessage.getText(),
                            lastMessage.getTimestamp(),
                            lastMessage.isRead()
                    )
            );
        }

        return conversations;
    }

    public Message saveMessage(Message message) {
        message.setTimestamp(LocalDateTime.now());
        message.setRead(false);
        return messageRepository.save(message);
    }

    public List<Message> getChatMessages(String senderId, String receiverId) {
        return messageRepository.findBySenderIdAndReceiverIdOrderByTimestampAsc(senderId, receiverId);
    }

    public List<Message> getChatHistory(String userId1, String userId2) {
        return messageRepository
                .findBySenderIdInAndReceiverIdInOrderByTimestampAsc(
                        Arrays.asList(userId1, userId2),
                        Arrays.asList(userId1, userId2)
                );
    }

    public void markMessagesAsRead(String senderId, String receiverId) {

        List<Message> unreadMessages =
                messageRepository.findBySenderIdAndReceiverIdAndReadFalse(
                        senderId,
                        receiverId
                );

        if (unreadMessages.isEmpty()) {
            return;
        }

        unreadMessages.forEach(message -> message.setRead(true));
        messageRepository.saveAll(unreadMessages);

        ReadReceiptDTO dto = new ReadReceiptDTO(senderId, receiverId);

        messagingTemplate.convertAndSend("/topic/read", dto);
    }
}