package com.example.backend.service;

import com.example.backend.dto.TreatmentIntakeDTO;
import com.example.backend.model.Treatment;
import com.example.backend.model.TreatmentIntake;
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

    public Treatment markTreatmentIntake(TreatmentIntakeDTO treatmentIntake) {

        String treatmentId = treatmentIntake.getTreatmentId();
        String patientId = treatmentIntake.getPatientId();
        LocalDate date = treatmentIntake.getDate();
        Integer doseIndex = treatmentIntake.getDoseIndex();

        Treatment treatment = treatmentRepository.findById(treatmentId)
                .orElseThrow(() -> new RuntimeException("Tratament inexistent"));

        if (!treatment.getPatientId().equals(patientId)) {
            throw new RuntimeException("Acces interzis");
        }

        TreatmentIntake intake = treatment.getTreatmentIntakes()
                .stream()
                .filter(i ->
                        toLocalDate(i.getDate()).equals(date) &&
                                i.getDoseIndex().equals(doseIndex)
                )
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Doza nu există"));

        if (intake.getTakenAt() != null) {
            throw new RuntimeException("Doza este deja administrată");
        }

        if (date.isBefore(toLocalDate(treatment.getStartDate())) ||
                date.isAfter(toLocalDate(treatment.getEndDate()))) {
            throw new RuntimeException("Data este în afara tratamentului");
        }

        if (date.isAfter(LocalDate.now())) {
            throw new RuntimeException("Nu se poate marca o doză din viitor");
        }

        intake.setTakenAt(new Date());

        return treatmentRepository.save(treatment);
    }

    private LocalDate toLocalDate(Date date) {
        return date.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();
    }
}
