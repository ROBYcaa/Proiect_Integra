package com.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "treatments")
public class Treatment {

    @Id
    private String id;
    private String medicationName;
    private String dosage;
    private int timesPerDay;
    private String doctorId;
    private String patientId;
    private String notes;
    private Date startDate;
    private Date endDate;

    public Treatment() {}

    public Treatment(String medicationName, String dosage, int timesPerDay, String doctorId, String patientId, String notes, Date startDate, Date endDate) {
        this.medicationName = medicationName;
        this.dosage = dosage;
        this.timesPerDay = timesPerDay;
        this.doctorId = doctorId;
        this.patientId = patientId;
        this.notes = notes;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public String getId() { return id; }

    public String getMedicationName() { return medicationName; }
    public void setMedicationName(String medicationName) { this.medicationName = medicationName; }

    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }

    public int getTimesPerDay() { return timesPerDay; }
    public void setTimesPerDay(int timesPerDay) { this.timesPerDay = timesPerDay; }

    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getPatientID() { return patientId; }
    public void setPatientID(String patientID) { this.patientId = patientId; }

    public Date getStartDate() { return startDate; }
    public void setStartDate(Date startDate) { this.startDate = startDate; }

    public Date getEndDate() { return endDate; }
    public void setEndDate(Date endDate) { this.endDate = endDate; }

}
