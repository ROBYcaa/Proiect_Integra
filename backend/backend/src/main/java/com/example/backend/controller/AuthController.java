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
import java.util.Optional;

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

        String accessToken = jwtUtil.generateToken(user.getId(), user.getRole());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        return ResponseEntity.ok(Map.of(
                "accessToken", accessToken,
                "refreshToken", refreshToken.getToken(),
                "role", user.getRole()
        ));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshAccessToken(@RequestBody Map<String, String> request) {
        String oldRefreshToken = request.get("refreshToken");

        Optional<RefreshToken> existingToken = refreshTokenService.findByToken(oldRefreshToken);
        if (existingToken.isEmpty() || !refreshTokenService.validateRefreshToken(oldRefreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token invalid sau expirat.");
        }
        String userId = existingToken.get().getUserId();
        refreshTokenService.deleteByToken(oldRefreshToken);
        String newAccessToken = jwtUtil.generateToken(userId, "doctor");
        RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(userId);
        return ResponseEntity.ok(Map.of(
                "accessToken", newAccessToken,
                "refreshToken", newRefreshToken.getToken()
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> registerData) {
        String email = registerData.get("email");
        String password = registerData.get("password");
        String name = registerData.get("name");

        if (userService.getUserByEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Email deja folosit");
        }

        User newUser = new User();
        newUser.setEmail(email);
        newUser.setPassword(password);
        newUser.setRole("patient");

        User savedUser = userService.createUser(newUser);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                        "message", "Pacient înregistrat cu succes",
                        "userId", savedUser.getId(),
                        "email", savedUser.getEmail(),
                        "role", savedUser.getRole()
                ));
    }



}
