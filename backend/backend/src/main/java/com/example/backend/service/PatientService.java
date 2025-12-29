package com.example.backend.service;

import com.example.backend.model.Treatment;
import com.example.backend.repository.TreatmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {

    private final TreatmentRepository treatmentRepository;

    public PatientService(TreatmentRepository treatmentRepository) {
        this.treatmentRepository = treatmentRepository;
    }

    public List<Treatment> getTreatmentsForPatient(String patientId) {
        return treatmentRepository.findTreatmentByPatientId(patientId);
    }
}
