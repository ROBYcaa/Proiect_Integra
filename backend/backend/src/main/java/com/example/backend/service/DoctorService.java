package com.example.backend.service;

import com.example.backend.model.User;
import com.example.backend.model.UserDetail;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.UserDetailRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {

    private final UserRepository userRepository;
    private final UserDetailRepository userDetailRepository;

    public DoctorService(UserRepository userRepository, UserDetailRepository userDetailRepository) {
        this.userRepository = userRepository;
        this.userDetailRepository = userDetailRepository;
    }

    public List<User> getAllPatients() {
        return userRepository.findAll()
                .stream()
                .filter(user -> "patient".equalsIgnoreCase(user.getRole()))
                .toList();
    }

    public List<UserDetail> getAllPatientsDetails() {
        return userRepository.findAll()
                .stream()
                .filter(user -> "patient".equalsIgnoreCase(user.getRole()))
                .map(user -> userDetailRepository.findByUserId(user.getId()).orElse(null))
                .filter(details -> details != null)
                .toList();
    }
}
