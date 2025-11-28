package com.example.backend.dto;

import com.example.backend.model.Treatment;
import com.example.backend.model.UserDetail;
import com.example.backend.repository.UserDetailRepository;

import java.util.Date;


public class TreatmentDTO {
    private String id;
    private String dosage;
    private String medicationName;
    private int timesPerDay;
    private String patientId;
    private String patientFirstName;
    private String patientLastName;
    private String notes;
    private Date startDate;
    private Date endDate;
    private String doctorId;


    public TreatmentDTO(Treatment t, UserDetailRepository repo) {
        this.id = t.getId();
        this.medicationName = t.getMedicationName();
        this.dosage = t.getDosage();
        this.timesPerDay = t.getTimesPerDay();
        this.startDate = t.getStartDate();
        this.endDate = t.getEndDate();
        this.notes = t.getNotes();
        this.doctorId = t.getDoctorId();
        if (t.getPatientId() != null) {
            UserDetail patient = repo.findById(t.getPatientId()).orElse(null);
            if (patient != null) {
                this.patientId = t.getPatientId();
                this.patientFirstName = patient.getFirstName();
                this.patientLastName = patient.getLastName();
            }
        }
    }

    public String getId() {
        return id;
    }

    public String getDosage() {
        return dosage;
    }

    public String getMedicationName() {
        return medicationName;
    }

    public int getTimesPerDay() {
        return timesPerDay;
    }

    public String getPatientId() {
        return patientId;
    }

    public String getPatientFirstName() {
        return patientFirstName;
    }

    public String getPatientLastName() {
        return patientLastName;
    }

    public String getNotes() {
        return notes;
    }

    public Date getStartDate() {
        return startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public String getDoctorId() {
        return doctorId;
    }



    public void setId(String id) {
        this.id = id;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }

    public void setMedicationName(String medicationName) {
        this.medicationName = medicationName;
    }

    public void setTimesPerDay(int timesPerDay) {
        this.timesPerDay = timesPerDay;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public void setPatientFirstName(String patientFirstName) {
        this.patientFirstName = patientFirstName;
    }

    public void setPatientLastName(String patientLastName) {
        this.patientLastName = patientLastName;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }
}
