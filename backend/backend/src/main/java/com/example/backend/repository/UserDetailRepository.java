package com.example.backend.repository;

import com.example.backend.model.UserDetail;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserDetailRepository extends MongoRepository<UserDetail, String> {
    Optional<UserDetail> findByUserId(String userId);
    List<UserDetail> findByFirstNameContainingOrLastNameContaining(String firstName, String lastName);
}




