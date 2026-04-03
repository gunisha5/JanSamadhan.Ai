package com.grievance.grievance_system.service;

import com.grievance.grievance_system.client.AiServiceClient;
import com.grievance.grievance_system.dto.AiAnalysisRequest;
import com.grievance.grievance_system.dto.AiAnalysisResponse;
import com.grievance.grievance_system.entity.Priority;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AiFallbackService {

    private final AiServiceClient aiServiceClient;

    public AiFallbackService(AiServiceClient aiServiceClient) {
        this.aiServiceClient = aiServiceClient;
    }

    public AiAnalysisResponse getAnalysis(String text) {
        try {
            return aiServiceClient.analyzeComplaint(new AiAnalysisRequest(text));
        } catch (Exception e) {
            log.warn("AI Service unavailable or failed. Using fallback categorization for text: {}. Error: {}", text, e.getMessage());
            
            // Fallback logic
            return AiAnalysisResponse.builder()
                    .category("Uncategorized")
                    .priority(Priority.LOW)
                    .department("General Support")
                    .build();
        }
    }
}
