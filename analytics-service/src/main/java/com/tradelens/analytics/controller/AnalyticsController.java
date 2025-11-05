package com.tradelens.analytics.controller;

import com.tradelens.analytics.model.RiskReport;
import com.tradelens.analytics.service.RiskEngineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("")
@RequiredArgsConstructor
public class AnalyticsController {

    private final RiskEngineService riskEngineService;

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("✅ Analytics service is up and running on port 8084!");
    }

    /** 🔹 Get latest risk snapshot for a user */
    @GetMapping("/risk/{userId}")
    public ResponseEntity<RiskReport> getRiskReport(@PathVariable Long userId) {
        return ResponseEntity.ok(riskEngineService.getRiskReport(userId));
    }

    /** 🔹 Get last 7-day exposure history */
    @GetMapping("/history/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getRiskHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(riskEngineService.getHistoricalRisk(userId));
    }
}
