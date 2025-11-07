package com.example.backend.controller;

import com.example.backend.models.UserDetail;
import com.example.backend.service.UserDetailService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/userdetails")
public class UserDetailController {

    private final UserDetailService userDetailService;

    public UserDetailController(UserDetailService userDetailService) {
        this.userDetailService = userDetailService;
    }

    @GetMapping
    public List<UserDetail> allUserDetails() {
        return userDetailService.getAllUserDetails();
    }

    @GetMapping("/{id}")
    public Optional<UserDetail> findById(@PathVariable String id) {
        return userDetailService.getUserDetailById(id);
    }

    @GetMapping("/user/{userId}")
    public Optional<UserDetail> findByUserId(@PathVariable String userId) {
        return userDetailService.getUserDetailByUserId(userId);
    }

    @PostMapping
    public UserDetail addUserDetail(@RequestBody UserDetail userDetail) {
        return userDetailService.createUserDetail(userDetail);
    }

    @DeleteMapping("/{id}")
    public void deleteUserDetail(@PathVariable String id) {
        userDetailService.deleteUserDetailById(id);
    }
}
