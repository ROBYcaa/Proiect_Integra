package com.example.backend.service;

import com.example.backend.model.Treatment;
import com.example.backend.repository.TreatmentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
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

    public List<Treatment> getTreatmentsForPatientByDate(String patientId, LocalDate date) {

        Date startOfDay = Date.from(
                date.atStartOfDay(ZoneId.systemDefault()).toInstant()
        );

        Date endOfDay = Date.from(
                date.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant()
        );

        return treatmentRepository.findByPatientIdAndStartDateBetween(
                patientId,
                startOfDay,
                endOfDay
        );
    }
}
