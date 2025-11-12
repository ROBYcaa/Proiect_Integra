package com.example.backend.repository;

import com.example.backend.model.Treatment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface TreatmentRepository extends MongoRepository<Treatment, String> {
    Optional<Treatment> findByMedicationName(String medicationName);
    List<Treatment> findByMedicationNameContainingIgnoreCase(String medicationName);

}
