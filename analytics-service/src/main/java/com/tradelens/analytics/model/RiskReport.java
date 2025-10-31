package com.tradelens.analytics.model;

import lombok.*;

import java.time.Instant;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskReport {
    private Long userId;
    private Map<String, Integer> positions; // symbol -> net quantity
    private double totalExposure; // sum(price * quantity) - approximate
    private Instant lastUpdated;
}
