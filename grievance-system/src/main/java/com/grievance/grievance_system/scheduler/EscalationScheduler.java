package com.grievance.grievance_system.scheduler;

import com.grievance.grievance_system.entity.Complaint;
import com.grievance.grievance_system.entity.Status;
import com.grievance.grievance_system.repository.ComplaintRepository;
import com.grievance.grievance_system.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
public class EscalationScheduler {

    private final ComplaintRepository complaintRepository;
    private final ComplaintService complaintService;

    public EscalationScheduler(ComplaintRepository complaintRepository, ComplaintService complaintService) {
        this.complaintRepository = complaintRepository;
        this.complaintService = complaintService;
    }

    // Run every day at midnight. For testing, you can change this to run every minute e.g. "0 * * * * ?"
    @Scheduled(cron = "0 0 0 * * ?")
    public void checkAndEscalateComplaints() {
        log.info("Running scheduled task: Escalation of overdue complaints");

        LocalDateTime threshold = LocalDateTime.now().minusDays(3);
        List<Status> unresolvedStatuses = List.of(Status.PENDING, Status.ASSIGNED, Status.IN_PROGRESS);

        List<Complaint> overdueComplaints = complaintRepository
                .findOldUnresolvedComplaints(unresolvedStatuses, threshold);

        log.info("Found {} overdue complaints.", overdueComplaints.size());

        for (Complaint complaint : overdueComplaints) {
            complaintService.updateComplaintStatus(
                    complaint.getId(),
                    Status.ESCALATED,
                    "Automatically escalated due to SLA violation (older than 3 days)."
            );
            log.info("Escalated complaint ID: {}", complaint.getId());
        }
    }
}
