package com.example.backend.repository;

import com.example.backend.models.UserDetail;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserDetailRepository extends MongoRepository<UserDetail, String> {
    Optional<UserDetail> findByUserId(String userId);
}
