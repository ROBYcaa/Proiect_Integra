package com.example.backend.repository;

import com.example.backend.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findBySenderIdAndReceiverIdOrderByTimestampAsc(String senderId, String receiverId);
    List<Message> findBySenderIdInAndReceiverIdInOrderByTimestampAsc(
            List<String> senderIds,
            List<String> receiverIds
    );
    List<Message> findBySenderIdOrReceiverIdOrderByTimestampDesc(String senderId, String receiverId);
    List<Message> findBySenderIdAndReceiverIdAndReadFalse(
            String senderId,
            String receiverId
    );
    List<Message> findByReceiverIdAndReadFalse(String receiverId);
}