package com.example.backend.repository;

import com.example.backend.model.Treatment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface TreatmentRepository extends MongoRepository<Treatment, String> {
    Optional<Treatment> findByMedicationName(String medicationName);
    List<Treatment> findByMedicationNameContainingIgnoreCase(String medicationName);
    Page<Treatment> findByDoctorId(String doctorId, Pageable pageable);
    List<Treatment> findByPatientIdAndStartDateBetween(String patientId, Date startDate, Date endDate);
    List<Treatment> findTreatmentByPatientId(String patientId);
}
