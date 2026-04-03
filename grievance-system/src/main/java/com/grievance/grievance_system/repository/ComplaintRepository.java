package com.grievance.grievance_system.repository;

import com.grievance.grievance_system.entity.Complaint;
import com.grievance.grievance_system.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findAllByOrderByCreatedAtDesc();
    List<Complaint> findByUserId(Long userId);
    List<Complaint> findByDepartmentId(Long departmentId);
    
    @Query("SELECT c FROM Complaint c WHERE c.status IN :statuses AND c.createdAt < :thresholdDate")
    List<Complaint> findOldUnresolvedComplaints(
            @Param("statuses") List<Status> statuses, 
            @Param("thresholdDate") LocalDateTime thresholdDate
    );
}
