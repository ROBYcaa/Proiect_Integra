package com.example.backend.service;

import com.example.backend.model.User;
import com.example.backend.model.UserDetail;
import com.example.backend.repository.UserDetailRepository;

import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {
    @Autowired
    private UserRepository userRepository;



    private final UserDetailRepository userDetailRepository;

    public DoctorService(UserDetailRepository userDetailRepository) {
        this.userDetailRepository = userDetailRepository;
    }

    public List<UserDetail> getAllPatientDetails() {
        return userDetailRepository.findAll();
    }

    public List<UserDetail> getOnlyPatientDetails() {
        List<User> patients = userRepository.findAll()
                .stream()
                .filter(user -> "patient".equalsIgnoreCase(user.getRole()))
                .toList();

        List<String> patientIds = patients.stream()
                .map(User::getId)
                .toList();

        return userDetailRepository.findAllByUserIdIn(patientIds);
    }

}