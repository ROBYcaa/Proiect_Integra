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
public class UserDetailService {

    @Autowired
    private UserDetailRepository userDetailRepository;
    @Autowired
    private UserRepository userRepository;

    public UserDetailService(UserDetailRepository userDetailRepository) {
        this.userDetailRepository = userDetailRepository;
    }

    public List<UserDetail> getAllUserDetails() {
        return userDetailRepository.findAll();
    }

    public Optional<UserDetail> getUserDetailById(String id) {
        return userDetailRepository.findById(id);
    }

    public Optional<UserDetail> getUserDetailByUserId(String userId) {
        return userDetailRepository.findByUserId(userId);
    }

    public UserDetail createUserDetail(UserDetail userDetail) {
        return userDetailRepository.save(userDetail);
    }

    public void deleteUserDetailById(String id) {
        userDetailRepository.deleteById(id);
    }

    public List <UserDetail> searchPatients(String name) {
        return userDetailRepository.findByFirstNameContainingOrLastNameContaining(name, name);
    }

    public Optional<UserDetail> getByUserId(String userId) {
        return userDetailRepository.findByUserId(userId);
    }

    public List<UserDetail> findDoctors() {
        List<User> doctors = userRepository.findAll()
                .stream()
                .filter(user -> "doctor".equalsIgnoreCase(user.getRole()))
                .toList();

        List<String> doctorIds = doctors.stream()
                .map(User::getId)
                .toList();

        return userDetailRepository.findAllByUserIdIn(doctorIds);
    }
}
