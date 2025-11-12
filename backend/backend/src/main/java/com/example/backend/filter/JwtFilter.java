package com.example.backend.filter;
import io.jsonwebtoken.Claims;

import jakarta.servlet.Filter;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.example.backend.util.JwtUtil;
import jakarta.servlet.FilterChain;

import java.io.IOException;

@Component
public class JwtFilter implements Filter {
    @Autowired
    private JwtUtil jwtUtil;
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        String authHeader = httpRequest.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }
        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) {
            httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            httpResponse.getWriter().write("Token invalid sau expirat");
            return;
        }
        Claims claims = jwtUtil.extractClaims(token);
        httpRequest.setAttribute("role", claims.get("role"));
        httpRequest.setAttribute("userId", claims.getSubject());
        chain.doFilter(request, response);
    }
}