package com.example.backend.service;

import com.example.backend.models.User;
import com.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {

    private final UserRepository userRepository;

    public DoctorService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllPatients() {
        return userRepository.findAll()
                .stream()
                .filter(user -> "patient".equalsIgnoreCase(user.getRole()))
                .toList();
    }
}
