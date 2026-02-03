package com.example.backend.controller;

import com.example.backend.model.Treatment;
import com.example.backend.model.UserDetail;
import com.example.backend.service.TreatmentService;
import com.example.backend.model.User;
import com.example.backend.service.DoctorService;
import com.example.backend.service.UserDetailService;
import com.example.backend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/doctor")
public class DoctorController {

    private final DoctorService doctorService;
    private final TreatmentService treatmentService;
    private final UserDetailService userDetailService;

    public DoctorController(DoctorService doctorService, TreatmentService treatmentService, UserDetailService userDetailService) {
        this.doctorService = doctorService;
        this.treatmentService = treatmentService;
        this.userDetailService = userDetailService;
    }

    @GetMapping("/patients")
    public ResponseEntity<?> getAllPatients(HttpServletRequest request) {
        String role = (String) request.getAttribute("role");

        if (role == null || !"doctor".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Acces interzis: doar doctorii pot vedea lista pacienților.");
        }

        List<UserDetail> patients = doctorService.getAllPatientDetails();
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

    @GetMapping("/patients/{userId}/details")
    public ResponseEntity<?> getPatientDetails(@PathVariable String userId) {
        Optional<UserDetail> details = userDetailService.getByUserId(userId);

        if(details == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Nu există detalii pentru acest utilizator");
        }

        return ResponseEntity.ok(details);
    }

    @GetMapping("/patients-only")
    public ResponseEntity<List<UserDetail>> getOnlyPatients() {
        return ResponseEntity.ok(doctorService.getOnlyPatientDetails());
    }

}
