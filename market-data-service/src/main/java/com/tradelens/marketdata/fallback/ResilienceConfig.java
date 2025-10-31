package com.tradelens.marketdata.fallback;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.stereotype.Component;

@Component
public class ResilienceConfig {

    @CircuitBreaker(name = "marketDataCircuitBreaker", fallbackMethod = "fallbackPrice")
    public double fallbackPrice(String symbol, Throwable throwable) {
        System.err.println("Fallback triggered for " + symbol + ": " + throwable.getMessage());
        return 100.0; // default fallback value
    }
}
