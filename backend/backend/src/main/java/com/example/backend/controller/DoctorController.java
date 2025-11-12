package com.example.backend.controller;

import com.example.backend.models.User;
import com.example.backend.service.DoctorService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctor")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping("/patients")
    public ResponseEntity<?> getAllPatients(HttpServletRequest request) {
        String role = (String) request.getAttribute("role");

        if (role == null || !"doctor".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Acces interzis: doar doctorii pot vedea lista pacienților.");
        }

        List<User> patients = doctorService.getAllPatients();
        return ResponseEntity.ok(patients);
    }
}
