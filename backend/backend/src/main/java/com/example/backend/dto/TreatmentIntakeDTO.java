package com.example.backend.dto;

import java.util.Date;

public class TreatmentIntakeDTO {

    private String treatmentId;
    private String patientId;
    private Date date;
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

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public int getDoseIndex() {
        return doseIndex;
    }

    public void setDoseIndex(int doseIndex) {
        this.doseIndex = doseIndex;
    }
}
