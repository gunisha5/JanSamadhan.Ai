package com.grievance.grievance_system.dto;

import com.grievance.grievance_system.entity.Priority;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AiAnalysisResponse {
    private String category;
    private Priority priority;
    private String department;
}
