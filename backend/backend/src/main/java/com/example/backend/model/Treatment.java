package com.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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

    private List<TreatmentIntake> treatmentIntakes = new ArrayList<>();

    public Treatment() {}


    public String getId() { return id; }

    public String getMedicationName() { return medicationName; }
    public void setMedicationName(String medicationName) { this.medicationName = medicationName; }

    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }

    public int getTimesPerDay() { return timesPerDay; }
    public void setTimesPerDay(int timesPerDay) { this.timesPerDay = timesPerDay; }

    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Date getStartDate() { return startDate; }
    public void setStartDate(Date startDate) { this.startDate = startDate; }

    public Date getEndDate() { return endDate; }
    public void setEndDate(Date endDate) { this.endDate = endDate; }

    public List<TreatmentIntake> getTreatmentIntakes() {
        return treatmentIntakes;
    }

    public void setTreatmentIntakes(List<TreatmentIntake> treatmentIntakes) {
        this.treatmentIntakes = treatmentIntakes;
    }

    public void addTreatmentIntake(TreatmentIntake intake) {
        this.treatmentIntakes.add(intake);
    }
}
