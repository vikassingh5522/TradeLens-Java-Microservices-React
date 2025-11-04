package com.tradelens.portfolio.controller;

import com.tradelens.portfolio.model.Holding;
import com.tradelens.portfolio.model.Transaction;
import com.tradelens.portfolio.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/portfolio")
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService portfolioService;

    @GetMapping("/public/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok("Portfolio Service is running fine!");
    }

    @PostMapping("/add")
    public ResponseEntity<?> addTransaction(@RequestBody Transaction tx, Authentication authentication) {
        try {
            String userIdentifier;
            if (authentication != null && authentication.getName() != null) {
                userIdentifier = authentication.getName(); // usually email from JWT
            } else {
                userIdentifier = String.valueOf(tx.getUserId());
            }

            tx.setUserId(parseUserId(userIdentifier));
            Transaction saved = portfolioService.addTransaction(tx);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid user identification: " + e.getMessage());
        }
    }

    // ✅ FIXED VERSION — no Map.of(), no generic conflict
    @GetMapping("/holdings")
    public ResponseEntity<?> getHoldings(Authentication authentication) {
        try {
            String userIdentifier = authentication.getName();
            Long userId = parseUserId(userIdentifier);

            List<Holding> holdings = portfolioService.getHoldings(userId);

            // Build response safely for Java 17
            List<Map<String, Object>> response = holdings.stream()
                    .map(h -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("symbol", h.getSymbol());
                        map.put("quantity", h.getQuantity());
                        map.put("price", h.getAvgPrice());
                        map.put("avgPrice", h.getAvgPrice());
                        map.put("totalValue", h.getAvgPrice() * h.getQuantity());
                        return map;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Could not fetch holdings: " + e.getMessage());
        }
    }

    @GetMapping("/transactions")
    public ResponseEntity<?> getTransactions(Authentication authentication) {
        try {
            String userIdentifier = authentication.getName();
            Long userId = parseUserId(userIdentifier);
            return ResponseEntity.ok(portfolioService.getTransactions(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Could not fetch transactions: " + e.getMessage());
        }
    }

    private Long parseUserId(String value) {
        try {
            return Long.parseLong(value);
        } catch (NumberFormatException e) {
            return Math.abs(value.hashCode() % 100000L);
        }
    }
}
