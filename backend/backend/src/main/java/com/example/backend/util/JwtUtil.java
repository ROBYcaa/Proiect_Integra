package com.example.backend.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {
    private static final String SECRET_KEY =
            "ThisIsASecretKeyForJWTWithAtLeast256BitsLength!";

    private static final long TOKEN_EXPIRATION_TIME_MS = 1000 * 60 * 60;

    public String generateToken(String userId, String role) {
        return Jwts.builder()
                .setHeaderParam("typ"
                        ,
                        "JWT")
                .setSubject(userId)
                .claim("role"
                        , role)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }
}
