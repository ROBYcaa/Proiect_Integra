package com.example.backend.controller;

import com.example.backend.model.Treatment;
import com.example.backend.service.PatientService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patient")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping("/treatments/{patientId}")
    public List<Treatment> getPatientTreatments(@PathVariable String patientId) {
        return patientService.getTreatmentsForPatient(patientId);
    }
}
