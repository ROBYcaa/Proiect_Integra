package com.example.backend.service;

import com.example.backend.model.Treatment;
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

    public List<Treatment> getAllTreatments() {
        return treatmentRepository.findAll();
    }

    public Optional<Treatment> getTreatmentById(String id) {
        return treatmentRepository.findById(id);
    }

    public Optional<Treatment> getTreatmentByMedicationName(String medicationName) {
        return treatmentRepository.findByMedicationName(medicationName);
    }

    public Treatment createTreatment(Treatment treatment) {
        return treatmentRepository.save(treatment);
    }

    public void deleteTreatmentById(String id) {
        treatmentRepository.deleteById(id);
    }

    public List<Treatment> searchTreatments(String name) {
        return treatmentRepository.findByMedicationNameContainingIgnoreCase(name);
    }

    public Treatment updateTreatment(String id, Treatment newData) {
        Optional<Treatment> existingOpt = treatmentRepository.findById(id);

        if (existingOpt.isEmpty()) {
            return null;
        }

        Treatment existing = existingOpt.get();

        existing.setMedicationName(newData.getMedicationName());
        existing.setDosage(newData.getDosage());
        existing.setTimesPerDay(newData.getTimesPerDay());

        return treatmentRepository.save(existing);
    }


}
