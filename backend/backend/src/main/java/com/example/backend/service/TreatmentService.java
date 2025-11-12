package com.example.backend.service;

import com.example.backend.models.Treatments;
import com.example.backend.repository.TreatmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TreatmentService {

    @Autowired
    private TreatmentRepository treatmentRepository;

    public TreatmentService(TreatmentRepository treatmentRepository) {
        this.treatmentRepository = treatmentRepository;
    }

    public List<Treatments> getAllTreatments() {
        return treatmentRepository.findAll();
    }

    public Optional<Treatments> getTreatmentById(String id) {
        return treatmentRepository.findById(id);
    }

    public Optional<Treatments> getTreatmentByMedicationName(String medicationName) {
        return treatmentRepository.findByMedicationName(medicationName);
    }

    public Treatments createTreatment(Treatments treatment) {
        return treatmentRepository.save(treatment);
    }

    public void deleteTreatmentById(String id) {
        treatmentRepository.deleteById(id);
    }

    public List<Treatments> searchTreatments(String name) {
        return treatmentRepository.findByMedicationNameContainingIgnoreCase(name);
    }
}
