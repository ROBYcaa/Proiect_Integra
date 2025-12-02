package com.example.backend.controller;

import com.example.backend.dto.TreatmentDTO;
import com.example.backend.model.Treatment;
import com.example.backend.model.User;
import com.example.backend.repository.UserDetailRepository;
import com.example.backend.service.TreatmentService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.example.backend.repository.UserRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/treatments")
public class TreatmentsController {

    private final TreatmentService treatmentService;
    private final UserDetailRepository userDetailRepository;

    public TreatmentsController(TreatmentService treatmentService, UserDetailRepository userDetailRepository) {
        this.treatmentService = treatmentService;
        this.userDetailRepository = userDetailRepository;
    }

    @GetMapping
    public List<Treatment> allTreatments() {
        return treatmentService.getAllTreatments();
    }

    @GetMapping("/{id}")
    public Optional<Treatment> findById(@PathVariable String id) {
        return treatmentService.getTreatmentById(id);
    }

    @GetMapping("/name/{medicationName}")
    public Optional<Treatment> findByMedicationName(@PathVariable String medicationName) {
        return treatmentService.getTreatmentByMedicationName(medicationName);
    }

    @PostMapping("/addTreatment")
    public Treatment addTreatment(@RequestBody Treatment t) {
        return treatmentService.createTreatment(t);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTreatment(@PathVariable String id) {
        treatmentService.deleteTreatment(id);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/search")
    public List<Treatment> searchTreatments(@RequestParam String name) {
        return treatmentService.searchTreatments(name);
    }

    @GetMapping("/doctor/{doctorId}")
    public List<TreatmentDTO> getTreatmentsByDoctor(@PathVariable String doctorId) {
        List<Treatment> treatments = treatmentService.getTreatmentsByDoctor(doctorId);
        return treatments.stream()
                .map(treatment -> new TreatmentDTO(treatment, userDetailRepository))
                .collect(Collectors.toList());
    }

    @PutMapping("/{id}")
    public Treatment updateTreatment(@PathVariable String id,@RequestBody Treatment updatedTreatment) {
        return treatmentService.updateTreatment(id, updatedTreatment);
    }
}
