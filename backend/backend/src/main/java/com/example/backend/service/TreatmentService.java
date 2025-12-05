package com.example.backend.service;

import com.example.backend.model.Treatment;
import com.example.backend.repository.TreatmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class TreatmentService {

    @Autowired
    private TreatmentRepository treatmentRepository;
    @Autowired
    private MongoTemplate mongoTemplate;

    public TreatmentService(TreatmentRepository treatmentRepository) {
        this.treatmentRepository = treatmentRepository;
    }

    public List<Treatment> getAllTreatments() {
        return treatmentRepository.findAll();
    }

    public Optional<Treatment> getTreatmentById(String id) {
        return treatmentRepository.findById(id);
    }

    public Optional<Treatment> getTreatmentByMedicationName(String medicationName) {
        return treatmentRepository.findByMedicationName(medicationName);
    }

    public Treatment createTreatment(Treatment treatment) {
        return treatmentRepository.save(treatment);
    }

    public void deleteTreatment(String id) {
        treatmentRepository.deleteById(id);
    }

    public List<Treatment> searchTreatments(String name) {
        return treatmentRepository.findByMedicationNameContainingIgnoreCase(name);
    }

    public Treatment updateTreatment(String id, Treatment newData) {
        Optional<Treatment> existingOpt = treatmentRepository.findById(id);

        if (existingOpt.isEmpty()) {
            return null;
        }

        Treatment existing = existingOpt.get();

        existing.setMedicationName(newData.getMedicationName());
        existing.setDosage(newData.getDosage());
        existing.setTimesPerDay(newData.getTimesPerDay());
        existing.setStartDate(newData.getStartDate());
        existing.setEndDate(newData.getEndDate());
        existing.setNotes(newData.getNotes());

        return treatmentRepository.save(existing);
    }

    public Page<Treatment> getTreatmentsByDoctor(
            String doctorId,
            Pageable pageable,
            String search,
            String filter
    ) {
        Query query = new Query();
        query.addCriteria(Criteria.where("doctorId").is(doctorId));
        if (search != null && !search.isEmpty()) {
            String regex =
                    ".*" + search.toLowerCase() + ".*";
            query.addCriteria(new Criteria().orOperator(
                    Criteria.where("medicationName").regex(regex, "i"),
                    Criteria.where("patientFirstName").regex(regex, "i"),
                    Criteria.where("patientLastName").regex(regex, "i")
            ));

        }
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        Date todayDate = Date.from(todayStart.atZone(ZoneId.of("UTC")).toInstant());

        if (filter != null) {
            switch (filter) {
                case "active":
                    query.addCriteria(Criteria.where("endDate").gt(todayDate));
                    break;

                case "ended":
                    query.addCriteria(Criteria.where("endDate").lt(todayDate));
                    break;

                case "noEnd":
                    query.addCriteria(new Criteria().orOperator(
                            Criteria.where("endDate").exists(false),
                            Criteria.where("endDate").is(null),
                            Criteria.where("endDate").is("")
                    ));
                    break;
            }
        }
        long total = mongoTemplate.count(query, Treatment.class);
        query.with(pageable);
        List<Treatment> results = mongoTemplate.find(query, Treatment.class);
        return new PageImpl<>(results, pageable, total);
    }
}
