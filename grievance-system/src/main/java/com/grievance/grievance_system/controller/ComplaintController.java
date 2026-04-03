package com.grievance.grievance_system.controller;

import com.grievance.grievance_system.dto.ComplaintRequest;
import com.grievance.grievance_system.dto.UpdateComplaintStatusRequest;
import com.grievance.grievance_system.entity.Complaint;
import com.grievance.grievance_system.entity.ComplaintHistory;
import com.grievance.grievance_system.service.ComplaintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    // Feature 2: Complaint Submission
    @PostMapping
    public ResponseEntity<Complaint> submitComplaint(
            @Valid @RequestBody ComplaintRequest request,
            Authentication authentication
    ) {
        String email = authentication.getName();
        return ResponseEntity.ok(complaintService.submitComplaint(email, request));
    }

    // Citizen: View own complaints
    @GetMapping
    public ResponseEntity<List<Complaint>> getMyComplaints(Authentication authentication) {
        return ResponseEntity.ok(complaintService.getComplaintsByUser(authentication.getName()));
    }

    // Admin: View all complaints
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    // Feature 5: Complaint Tracking
    @GetMapping("/{id}/status")
    public ResponseEntity<List<ComplaintHistory>> getComplaintTracking(@PathVariable Long id) {
        return ResponseEntity.ok(complaintService.getComplaintTracking(id));
    }

    // Feature 6: Complaint Resolution / Update
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Complaint> updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateComplaintStatusRequest request
    ) {
        return ResponseEntity.ok(
                complaintService.updateComplaintStatus(id, request.getStatus(), request.getRemarks())
        );
    }
}
