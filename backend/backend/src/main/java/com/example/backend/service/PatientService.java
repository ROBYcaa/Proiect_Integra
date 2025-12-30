package com.example.backend.service;

import com.example.backend.dto.TreatmentIntakeDTO;
import com.example.backend.model.Treatment;
import com.example.backend.model.TreatmentIntake;
import com.example.backend.repository.TreatmentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
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

        Date selectedDate = Date.from(
                date.atStartOfDay(ZoneId.systemDefault()).toInstant()
        );

        return treatmentRepository.findByPatientIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                patientId,
                selectedDate,
                selectedDate
        );
    }

    public Treatment markTreatmentIntake(TreatmentIntakeDTO treatmentIntakeDTO) {

        String treatmentId = treatmentIntakeDTO.getTreatmentId();
        String patientId = treatmentIntakeDTO.getPatientId();
        Date intakeDate = treatmentIntakeDTO.getDate();
        Integer doseIndex = treatmentIntakeDTO.getDoseIndex();

        Treatment treatment = treatmentRepository.findById(treatmentId)
                .orElseThrow(() -> new RuntimeException("Tratament inexistent"));

        if (!treatment.getPatientId().equals(patientId)) {
            throw new RuntimeException("Acces interzis");
        }

        if (treatment.getTreatmentIntakes() == null) {
            treatment.setTreatmentIntakes(new ArrayList<>());
        }

        if (intakeDate.before(treatment.getStartDate()) || intakeDate.after(treatment.getEndDate())) {
            throw new RuntimeException("Data este în afara tratamentului");
        }

        if (intakeDate.after(new Date())) {
            throw new RuntimeException("Nu se poate marca o doză din viitor");
        }

        TreatmentIntake intake = new TreatmentIntake();
        intake.setDate(intakeDate);
        intake.setDoseIndex(doseIndex);

        treatment.addTreatmentIntake(intake);

        return treatmentRepository.save(treatment);
    }

    private LocalDate toLocalDate(Date date) {
        return date.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();
    }
}
