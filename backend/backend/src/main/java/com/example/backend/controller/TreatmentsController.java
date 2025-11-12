package com.example.backend.controller;

import com.example.backend.model.Treatment;
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

    @PostMapping
    public Treatment addTreatment(@RequestBody Treatment treatment) {
        return treatmentService.createTreatment(treatment);
    }

     @DeleteMapping("/{id}")
    public void deleteTreatment(@PathVariable String id) {
        treatmentService.deleteTreatmentById(id);
    }

    @GetMapping("/search")
    public List<Treatment> searchTreatments(@RequestParam String name) {
        return treatmentService.searchTreatments(name);
    }
}
