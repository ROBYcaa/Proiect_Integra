package com.example.backend.controller;

import com.example.backend.models.Treatments;
import com.example.backend.service.TreatmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/treatments")
public class TreatmentsController {

    private final TreatmentService treatmentService;

    public TreatmentsController(TreatmentService treatmentService) {
        this.treatmentService = treatmentService;
    }

    @GetMapping
    public List<Treatments> allTreatments() {
        return treatmentService.getAllTreatments();
    }

    @GetMapping("/{id}")
    public Optional<Treatments> findById(@PathVariable String id) {
        return treatmentService.getTreatmentById(id);
    }

    @GetMapping("/name/{medicationName}")
    public Optional<Treatments> findByMedicationName(@PathVariable String medicationName) {
        return treatmentService.getTreatmentByMedicationName(medicationName);
    }

    @PostMapping
    public Treatments addTreatment(@RequestBody Treatments treatment) {
        return treatmentService.createTreatment(treatment);
    }

     @DeleteMapping("/{id}")
    public void deleteTreatment(@PathVariable String id) {
        treatmentService.deleteTreatmentById(id);
    }
}
