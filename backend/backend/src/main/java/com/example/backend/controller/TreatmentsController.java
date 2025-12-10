package com.example.backend.controller;

import com.example.backend.dto.ExportDTO;
import com.example.backend.dto.TreatmentDTO;
import com.example.backend.model.Treatment;
import com.example.backend.repository.UserDetailRepository;
import com.example.backend.service.TreatmentService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import org.springframework.data.domain.Pageable;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/treatments")
public class TreatmentsController {

    private final TreatmentService treatmentService;
    private final UserDetailRepository userDetailRepository;

    public TreatmentsController(TreatmentService treatmentService, UserDetailRepository userDetailRepository) {
        this.treatmentService = treatmentService;
        this.userDetailRepository = userDetailRepository;
    }

    @GetMapping
    public List<Treatment> allTreatments() {
        return treatmentService.getAllTreatments();
    }

    @GetMapping("/{id}")
    public Optional<Treatment> findById(@PathVariable String id) {
        return treatmentService.getTreatmentById(id);
    }

    @GetMapping("/name/{medicationName}")
    public Optional<Treatment> findByMedicationName(@PathVariable String medicationName) {
        return treatmentService.getTreatmentByMedicationName(medicationName);
    }

    @PostMapping("/addTreatment")
    public Treatment addTreatment(@RequestBody Treatment t) {
        return treatmentService.createTreatment(t);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTreatment(@PathVariable String id) {
        treatmentService.deleteTreatment(id);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/search")
    public List<Treatment> searchTreatments(@RequestParam String name) {
        return treatmentService.searchTreatments(name);
    }

    @GetMapping("/doctor/{doctorId}")
    public Page<TreatmentDTO> getTreatmentsByDoctor(@PathVariable String doctorId,
                                                    @RequestParam(defaultValue = "0") int page,
                                                    @RequestParam(defaultValue = "10") int size,
                                                    @RequestParam(required = false) String search,
                                                    @RequestParam(defaultValue = "all") String filter
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Treatment> treatmentsPage =
                treatmentService.getTreatmentByDoctorId(
                        doctorId,
                        pageable,
                        search,
                        filter
                );
        return treatmentsPage.map(t -> new TreatmentDTO(t, userDetailRepository));
    }


    @PutMapping("/{id}")
    public Treatment updateTreatment(@PathVariable String id,@RequestBody Treatment updatedTreatment) {
        return treatmentService.updateTreatment(id, updatedTreatment);
    }

    @PostMapping("/export")
    public ResponseEntity<Void> exportPdf(@RequestBody ExportDTO request) {

        String patientId = request.getPatientId();
        Date startDate = request.getStartDate();
        Date endDate = request.getEndDate();

        List<Treatment> treatments = treatmentService.findTreatmentsForExport(patientId, startDate, endDate);

        return ResponseEntity.noContent().build();
    }
}
