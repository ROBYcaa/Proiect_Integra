package com.example.backend.service;

import com.example.backend.dto.RegisterRequest;
import com.example.backend.model.User;
import com.example.backend.model.UserDetail;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.UserDetailRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final UserDetailRepository userDetailRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       UserDetailRepository userDetailRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userDetailRepository = userDetailRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("patient");

        User savedUser = userRepository.save(user);

        UserDetail details = new UserDetail();
        details.setUserId(savedUser.getId());
        details.setFirstName(request.getFirstName());
        details.setLastName(request.getLastName());
        details.setSex(request.getSex());
        details.setHeight(request.getHeight());
        details.setWeight(request.getWeight());
        details.setDateOfBirth(request.getDateOfBirth());

        userDetailRepository.save(details);
    }
}
