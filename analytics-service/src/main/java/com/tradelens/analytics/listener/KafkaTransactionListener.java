package com.tradelens.analytics.listener;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tradelens.analytics.model.TransactionEvent;
import com.tradelens.analytics.service.RiskEngineService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class KafkaTransactionListener {

    private final RiskEngineService riskEngineService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = "portfolio-transactions", groupId = "analytics-group")
    public void onMessage(String message) {
        try {
            TransactionEvent tx = objectMapper.readValue(message, TransactionEvent.class);
            log.info("[KAFKA] Received tx: user={} symbol={} type={} qty={}",
                    tx.getUserId(), tx.getSymbol(), tx.getType(), tx.getQuantity());
            riskEngineService.processTransaction(tx);
        } catch (Exception e) {
            log.error("[KAFKA] Failed to parse/process message: {}", message, e);
        }
    }
}
