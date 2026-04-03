package com.grievance.grievance_system.client;

import com.grievance.grievance_system.dto.AiAnalysisRequest;
import com.grievance.grievance_system.dto.AiAnalysisResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "ai-service", url = "${ai.service.url:http://localhost:5000}")
public interface AiServiceClient {

    @PostMapping("/ai/analyze")
    AiAnalysisResponse analyzeComplaint(@RequestBody AiAnalysisRequest request);
}
