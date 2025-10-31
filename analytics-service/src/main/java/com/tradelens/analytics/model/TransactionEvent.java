package com.tradelens.analytics.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class TransactionEvent {
    private Long id;
    private Long userId;
    private String symbol;
    private Integer quantity;
    private Double price;
    private String type; // "BUY" or "SELL"
    private Instant timestamp;
}
