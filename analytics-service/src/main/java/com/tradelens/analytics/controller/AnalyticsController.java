package com.tradelens.analytics.controller;

import com.tradelens.analytics.model.RiskReport;
import com.tradelens.analytics.service.RiskEngineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final RiskEngineService riskEngineService;

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("✅ Analytics service is up (port default).");
    }

    @GetMapping("/risk/{userId}")
    public ResponseEntity<RiskReport> getRiskReport(@PathVariable Long userId) {
        RiskReport report = riskEngineService.getRiskReport(userId);
        return ResponseEntity.ok(report);
    }
}
