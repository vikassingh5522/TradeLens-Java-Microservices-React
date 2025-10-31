package com.tradelens.analytics.service;

import com.tradelens.analytics.model.RiskReport;
import com.tradelens.analytics.model.TransactionEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Very simple in-memory risk engine for demo:
 * - Maintains per-user positions (symbol -> quantity)
 * - Keeps an approximate exposure using incoming tx price
 */
@Service
@Slf4j
public class RiskEngineService {

    // userId -> (symbol -> quantity)
    private final Map<Long, Map<String, Integer>> positions = new ConcurrentHashMap<>();

    // userId -> last computed exposure (approx)
    private final Map<Long, Double> exposures = new ConcurrentHashMap<>();

    public void processTransaction(TransactionEvent tx) {
        if (tx == null || tx.getUserId() == null) return;
        Long userId = tx.getUserId();
        String symbol = tx.getSymbol().toUpperCase();
        int qty = tx.getQuantity() == null ? 0 : tx.getQuantity();
        double price = tx.getPrice() == null ? 0.0 : tx.getPrice();

        positions.computeIfAbsent(userId, k -> new ConcurrentHashMap<>());

        Map<String, Integer> userPositions = positions.get(userId);
        int current = userPositions.getOrDefault(symbol, 0);

        if ("BUY".equalsIgnoreCase(tx.getType())) {
            current += qty;
        } else if ("SELL".equalsIgnoreCase(tx.getType())) {
            current -= qty;
            if (current < 0) current = 0; // keep it simple: no shorts
        }

        userPositions.put(symbol, current);

        // approximate exposure: sum(symbolQty * lastTxPrice) — simple approach
        double total = userPositions.entrySet().stream()
                .mapToDouble(e -> {
                    String s = e.getKey();
                    int q = e.getValue();
                    // if same symbol as current tx, use current tx price; else assume last known price = price (approx).
                    return q * (s.equals(symbol) ? price : price);
                })
                .sum();

        exposures.put(userId, total);

        log.info("[RISK] processed tx user={} symbol={} type={} qty={} price={} -> exposure={}",
                userId, symbol, tx.getType(), qty, price, total);
    }

    public RiskReport getRiskReport(Long userId) {
        Map<String, Integer> userPos = positions.getOrDefault(userId, Map.of());
        double exposure = exposures.getOrDefault(userId, 0.0);
        return RiskReport.builder()
                .userId(userId)
                .positions(userPos)
                .totalExposure(Math.round(exposure * 100.0) / 100.0)
                .lastUpdated(Instant.now())
                .build();
    }
}
