package com.tradelens.marketdata.service;

import com.tradelens.marketdata.model.PriceSnapshot;
import com.tradelens.marketdata.repository.PriceSnapshotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class MarketDataService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final PriceSnapshotRepository priceSnapshotRepository;
    private final Random random = new Random();

    // 🎨 ANSI color codes for beautiful console output
    private static final String GREEN = "\u001B[32m";
    private static final String YELLOW = "\u001B[33m";
    private static final String CYAN = "\u001B[36m";
    private static final String RESET = "\u001B[0m";

    public PriceSnapshot getPrice(String symbol) {
        String cacheKey = "PRICE_" + symbol.toUpperCase();

        // ✅ 1. Check Redis Cache
        PriceSnapshot cached = (PriceSnapshot) redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            System.out.println(GREEN + "📦 [CACHE HIT] " + symbol + " price = " + cached.getPrice() + RESET);
            return cached;
        }

        // ✅ 2. Generate Mock Price (later can use real API)
        double price = 100 + random.nextDouble() * 100;
        PriceSnapshot snapshot = PriceSnapshot.builder()
                .symbol(symbol.toUpperCase())
                .price(Math.round(price * 100.0) / 100.0)
                .timestamp(Instant.now())
                .build();

        // ✅ 3. Save to Redis Cache (TTL = 60 sec)
        redisTemplate.opsForValue().set(cacheKey, snapshot, 60, TimeUnit.SECONDS);

        // ✅ 4. Save to MySQL for record
        priceSnapshotRepository.save(snapshot);

        // ✅ 5. Console Log (Color-coded)
        System.out.println(YELLOW + "💾 [CACHE MISS] New price generated and cached → "
                + CYAN + symbol + " = " + snapshot.getPrice() + RESET);

        return snapshot;
    }
}
