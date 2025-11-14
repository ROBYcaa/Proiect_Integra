package com.example.backend.controller;

import com.example.backend.model.Treatment;
import com.example.backend.service.TreatmentService;
import com.example.backend.model.User;
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
    private final TreatmentService treatmentService;

    public DoctorController(DoctorService doctorService, TreatmentService treatmentService) {
        this.doctorService = doctorService;
        this.treatmentService = treatmentService;
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

    @PostMapping("/treatments")
    public ResponseEntity<?> createTreatment(@RequestBody Treatment treatment,
                                             HttpServletRequest request) {
        String role = (String) request.getAttribute("role");

        if (role == null || !"doctor".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Acces interzis: doar doctorii pot crea tratamente.");
        }
        Treatment savedTreatment = treatmentService.createTreatment(treatment);
        return ResponseEntity.ok(savedTreatment);
    }

    @PutMapping("/treatments/{id}")
    public ResponseEntity<?> updateTreatment(@PathVariable String id,
                                             @RequestBody Treatment updatedData,
                                             HttpServletRequest request) {

        String role = (String) request.getAttribute("role");

        if (role == null || !"doctor".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Acces interzis: doar doctorii pot modifica tratamente.");
        }

        Treatment updated = treatmentService.updateTreatment(id, updatedData);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Tratamentul nu a fost găsit.");
        }

        return ResponseEntity.ok(updated);
    }
}
