package com.example.backend.repository;

import com.example.backend.models.Treatments;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface TreatmentRepository extends MongoRepository<Treatments, String> {
    Optional<Treatments> findByMedicationName(String medicationName);
    List<Treatments> findByTreatmentNameContainingIgnoreCase(String treatmentName);

}
