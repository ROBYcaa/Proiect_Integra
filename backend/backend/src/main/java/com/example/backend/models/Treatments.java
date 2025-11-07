package com.example.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "treatments")
public class Treatments {

    @Id
    private String id;
    private String medicationName;
    private String dosage;
    private int timesPerDay; // înlocuiește timestamps

    public Treatments() {}

    public Treatments(String medicationName, String dosage, int timesPerDay) {
        this.medicationName = medicationName;
        this.dosage = dosage;
        this.timesPerDay = timesPerDay;
    }

    // Getteri și setteri
    public String getId() { return id; }

    public String getMedicationName() { return medicationName; }
    public void setMedicationName(String medicationName) { this.medicationName = medicationName; }

    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }

    public int getTimesPerDay() { return timesPerDay; }
    public void setTimesPerDay(int timesPerDay) { this.timesPerDay = timesPerDay; }
}
