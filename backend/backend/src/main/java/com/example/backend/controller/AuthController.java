package com.example.backend.controller;

import com.example.backend.model.RefreshToken;
import com.example.backend.model.User;
import com.example.backend.service.UserService;
import com.example.backend.service.RefreshTokenService;
import com.example.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private RefreshTokenService refreshTokenService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");

        User user = userService.getUserByEmail(email).orElse(null);
        if (user == null || !user.getPassword().equals(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credențiale invalide");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getRole());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        return ResponseEntity.ok(Map.of("token"
                , token,
                "role"
                , user.getRole()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshAccessToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        if (refreshTokenService.validateRefreshToken(refreshToken)) {
            String userId = refreshTokenService.findByToken(refreshToken).get().getUserId();
            String newAccessToken = jwtUtil.generateToken(userId,
                    "doctor");
            return ResponseEntity.ok(Map.of("accessToken"
                    , newAccessToken));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token invalid sau expirat.");
    }

}
