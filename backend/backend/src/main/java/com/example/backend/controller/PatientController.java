package com.example.backend.controller;

import com.example.backend.model.Treatment;
import com.example.backend.service.PatientService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
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

    @GetMapping("/treatments/{patientId}/date/{date}")
    public List<Treatment> getPatientTreatmentsByDate(
            @PathVariable String patientId,
            @PathVariable String date
    ) {
        LocalDate selectedDate = LocalDate.parse(date);
        return patientService.getTreatmentsForPatientByDate(patientId, selectedDate);
    }
}
