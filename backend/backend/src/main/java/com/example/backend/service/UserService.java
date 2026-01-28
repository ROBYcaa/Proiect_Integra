package com.example.backend.service;

import com.example.backend.model.User;
import com.example.backend.model.UserDetail;
import com.example.backend.repository.UserDetailRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

@Autowired
private final UserRepository userRepository;
    private final UserDetailRepository userDetailRepository;

    public UserService(UserRepository userRepository,
                       UserDetailRepository userDetailRepository) {
        this.userRepository = userRepository;
        this.userDetailRepository = userDetailRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUserById(String id) {
        userRepository.deleteById(id);
    }

    public List<User> findDoctors() {
        return userRepository.findByRole("doctor");
    }
}
