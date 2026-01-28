package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.model.UserDetail;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.UserDetailRepository;
import com.example.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final UserDetailRepository userDetailRepository;
    private final PasswordEncoder passwordEncoder;


    public UserController(UserRepository userRepository,
                          UserDetailRepository userDetailRepository, UserService userService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userDetailRepository = userDetailRepository;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }


    @GetMapping
    public List<User> AllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{email}")
    public Optional<User> findUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email);
    }

    @PostMapping
    public User addUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable String id) {
        userService.deleteUserById(id);
    }

    @GetMapping("/{userId}/details")
    public ResponseEntity<?> getUserDetails(@PathVariable String userId) {
        Optional<UserDetail> details = userDetailRepository.findByUserId(userId);
        if (details.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(details.get());
    }

    @PutMapping("/{userId}/details")
    public ResponseEntity<?> updateUserDetails(
            @PathVariable String userId,
            @RequestBody UserDetail updatedDetails
    ) {
        Optional<UserDetail> existing = userDetailRepository.findByUserId(userId);

        UserDetail details = existing.get();
        details.setFirstName(updatedDetails.getFirstName());
        details.setLastName(updatedDetails.getLastName());
        details.setSex(updatedDetails.getSex());
        details.setHeight(updatedDetails.getHeight());
        details.setWeight(updatedDetails.getWeight());
        details.setDateOfBirth(updatedDetails.getDateOfBirth());
        details.setExtraInfo(updatedDetails.getExtraInfo());

        userDetailRepository.save(details);

        return ResponseEntity.ok("User details updated");
    }

    @PutMapping("/{userId}/change-password")
    public ResponseEntity<?> changePassword(
            @PathVariable String userId,
            @RequestBody Map<String, String> body
    ) {
        String currentPassword = body.get("currentPassword");
        String newPassword = body.get("newPassword");

        Optional<User> userOpt = userRepository.findById(userId);

        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok("Password changed successfully");
    }

    @GetMapping("/doctors")
    public List<User> getDoctors() {
        return userService.findDoctors();
    }
}