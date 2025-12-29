package com.example.backend.dto;

import java.time.LocalDate;

public class TreatmentIntakeDTO {

    private String treatmentId;
    private String patientId;
    private LocalDate date;
    private int doseIndex;

    public String getTreatmentId() {
        return treatmentId;
    }

    public void setTreatmentId(String treatmentId) {
        this.treatmentId = treatmentId;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public int getDoseIndex() {
        return doseIndex;
    }

    public void setDoseIndex(int doseIndex) {
        this.doseIndex = doseIndex;
    }
}
