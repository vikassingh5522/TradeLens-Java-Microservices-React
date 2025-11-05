package com.tradelens.analytics.service;

import com.tradelens.analytics.model.RiskReport;
import com.tradelens.analytics.model.TransactionEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class RiskEngineService {

    private final SimpMessagingTemplate messagingTemplate;

    public RiskEngineService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    // 🗂 userId → (symbol → quantity)
    private final Map<Long, Map<String, Integer>> positions = new ConcurrentHashMap<>();

    // 💰 userId → latest exposure
    private final Map<Long, Double> exposures = new ConcurrentHashMap<>();

    // 🕒 userId → list of snapshots (for historical trends)
    private final Map<Long, List<RiskReport>> historyStore = new ConcurrentHashMap<>();

    /** 🔹 Handle incoming transaction (BUY / SELL) */
    public synchronized void processTransaction(TransactionEvent tx) {
        if (tx == null || tx.getUserId() == null) return;

        Long userId = tx.getUserId();
        String symbol = tx.getSymbol().toUpperCase(Locale.ROOT);
        int qty = Optional.ofNullable(tx.getQuantity()).orElse(0);
        double price = Optional.ofNullable(tx.getPrice()).orElse(0.0);

        // Ensure map exists
        positions.computeIfAbsent(userId, k -> new ConcurrentHashMap<>());
        Map<String, Integer> userPos = positions.get(userId);
        int currentQty = userPos.getOrDefault(symbol, 0);

        // 🟢 BUY or 🔴 SELL
        if ("BUY".equalsIgnoreCase(tx.getType())) {
            currentQty += qty;
        } else if ("SELL".equalsIgnoreCase(tx.getType())) {
            currentQty = Math.max(0, currentQty - qty);
        }
        userPos.put(symbol, currentQty);

        // 💹 Exposure = Σ(quantity × price)
        double totalExposure = userPos.entrySet().stream()
                .mapToDouble(e -> e.getValue() * price)
                .sum();
        exposures.put(userId, totalExposure);

        // 🕒 Snapshot
        RiskReport snapshot = RiskReport.builder()
                .userId(userId)
                .positions(new HashMap<>(userPos))
                .totalExposure(Math.round(totalExposure * 100.0) / 100.0)
                .lastUpdated(Instant.now())
                .build();

        // 📈 Save in history
        historyStore.computeIfAbsent(userId, k -> Collections.synchronizedList(new ArrayList<>())).add(snapshot);
        pruneOldHistory(userId);

        // 🛰 Push live update to frontend via STOMP
        try {
            messagingTemplate.convertAndSend("/topic/risk-updates", snapshot);
            log.info("📡 Sent WebSocket update to /topic/risk-updates for user {}", userId);
        } catch (Exception e) {
            log.warn("⚠️ WebSocket broadcast failed: {}", e.getMessage());
        }

        log.info("📊 Processed TX user={} symbol={} type={} qty={} price={} exposure={}",
                userId, symbol, tx.getType(), qty, price, totalExposure);
    }

    /** 🔹 Get latest snapshot */
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

    /** 🔹 Get 7-day historical trend */
    public List<Map<String, Object>> getHistoricalRisk(Long userId) {
        List<RiskReport> records = historyStore.getOrDefault(userId, List.of());
        List<Map<String, Object>> result = new ArrayList<>();
        for (RiskReport r : records) {
            LocalDate date = r.getLastUpdated()
                    .atZone(java.time.ZoneId.systemDefault())
                    .toLocalDate();
            result.add(Map.of("date", date.toString(), "exposure", r.getTotalExposure()));
        }
        return result.stream()
                .sorted(Comparator.comparing(m -> (String) m.get("date")))
                .limit(7)
                .toList();
    }

    /** 🔹 Remove snapshots older than 7 days */
    private void pruneOldHistory(Long userId) {
        List<RiskReport> list = historyStore.get(userId);
        if (list == null) return;
        Instant cutoff = Instant.now().minusSeconds(7 * 24 * 3600);
        list.removeIf(r -> r.getLastUpdated().isBefore(cutoff));
    }
}
