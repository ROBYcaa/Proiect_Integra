package com.example.backend.service;


import org.bson.Document;
import com.example.backend.model.Treatment;
import com.example.backend.repository.TreatmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.domain.PageImpl;

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
    private final MongoTemplate mongoTemplate;

    public TreatmentService(TreatmentRepository treatmentRepository,MongoTemplate mongoTemplate) {
        this.treatmentRepository = treatmentRepository;
        this.mongoTemplate = mongoTemplate;

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

    public Page<Treatment> getTreatmentByDoctorId(String doctorId,
                                                  Pageable pageable,
                                                  String search,
                                                  String filter) {
        Criteria baseCriteria = Criteria.where("doctorId").is(doctorId);

        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        Date todayDate = Date.from(todayStart.atZone(ZoneId.of("UTC")).toInstant());


        if (filter != null && !filter.equalsIgnoreCase("All")) {
            switch (filter.toLowerCase()) {
                case "active":
                    baseCriteria.and("endDate").gt(todayDate);
                    break;
                case "ended":
                    baseCriteria.and("endDate").lt(todayDate);
                    break;
                case "noenddate":
                    baseCriteria.orOperator(
                            Criteria.where("endDate").exists(false),
                            Criteria.where("endDate").is(null),
                            Criteria.where("endDate").is("")
                    );
                    break;
            }
        }


        MatchOperation matchDoctor = Aggregation.match(baseCriteria);

        LookupOperation lookupPatient = LookupOperation.newLookup()
                .from("userDetails")
                .localField("patientId")
                .foreignField("userId")
                .as("patient");


        UnwindOperation unwindPatient = Aggregation.unwind("patient", true);

        Criteria searchCriteria = new Criteria();
        if (search != null && !search.trim().isEmpty()) {
            String regex = ".*" + search.toLowerCase() + ".*";

            searchCriteria.orOperator(
                    Criteria.where("medicationName").regex(regex, "i"),
                    Criteria.where("patient.firstName").regex(regex, "i"),
                    Criteria.where("patient.lastName").regex(regex, "i")
            );
        }
        MatchOperation matchSearch = Aggregation.match(searchCriteria);

        Aggregation aggregation = Aggregation.newAggregation(
                matchDoctor,
                lookupPatient,
                unwindPatient,
                matchSearch,
                Aggregation.skip((long) pageable.getPageNumber() * pageable.getPageSize()),
                Aggregation.limit(pageable.getPageSize())
        );

        List<Treatment> results = mongoTemplate.aggregate(aggregation, "treatments", Treatment.class).getMappedResults();

        Aggregation countAggregation = Aggregation.newAggregation(
                matchDoctor,
                lookupPatient,
                unwindPatient,
                matchSearch,
                Aggregation.count().as("total")
        );


        AggregationResults<Document> countResults = mongoTemplate.aggregate(countAggregation, "treatments", Document.class);
        Document countDoc = countResults.getUniqueMappedResult();
        long total = countDoc != null ? countDoc.get("total", Number.class).longValue() : 0L;



        return new PageImpl<>(results, pageable, total);
    }
    public List<Treatment> findTreatmentsForExport(String patientId, Date startDate, Date endDate) {
        return treatmentRepository
                .findByPatientIdAndStartDateBetween(patientId, startDate, endDate);
    }

}