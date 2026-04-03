package com.grievance.grievance_system.dto;

import com.grievance.grievance_system.entity.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateComplaintStatusRequest {
    private Status status;
    private String remarks;
}
