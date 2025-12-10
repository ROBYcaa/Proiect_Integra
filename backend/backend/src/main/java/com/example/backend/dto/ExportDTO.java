package com.example.backend.dto;

import java.util.Date;

public class ExportDTO {
    private String patientId;
    private Date startDate;
    private Date endDate;

    public ExportDTO(String patientId, Date startDate, Date endDate) {
        this.patientId = patientId;
        this.startDate = startDate;
        this.endDate = endDate;
    }
    public String getPatientId() {
        return patientId;
    }
    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }
    public Date getStartDate() {
        return startDate;
    }
    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }
    public Date getEndDate() {
        return endDate;
    }
    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

}
