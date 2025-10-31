package com.tradelens.marketdata.controller;

import com.tradelens.marketdata.model.PriceSnapshot;
import com.tradelens.marketdata.service.MarketDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/marketdata")
@RequiredArgsConstructor
public class MarketDataController {

    private final MarketDataService marketDataService;

    @GetMapping("/price/{symbol}")
    public ResponseEntity<PriceSnapshot> getPrice(@PathVariable String symbol) {
        return ResponseEntity.ok(marketDataService.getPrice(symbol));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("✅ Market Data Service is running on port 8083!");
    }
}
