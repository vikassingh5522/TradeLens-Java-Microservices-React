package com.tradelens.portfolio.service;

import com.tradelens.portfolio.model.Holding;
import com.tradelens.portfolio.model.Transaction;
import com.tradelens.portfolio.repository.HoldingRepository;
import com.tradelens.portfolio.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final TransactionRepository transactionRepository;
    private final HoldingRepository holdingRepository;

    @Transactional
    public Transaction addTransaction(Transaction tx) {
        tx.setTimestamp(Instant.now());
        Transaction saved = transactionRepository.save(tx);


        Holding holding = holdingRepository.findByUserIdAndSymbol(tx.getUserId(), tx.getSymbol())
                .orElse(Holding.builder()
                        .userId(tx.getUserId())
                        .symbol(tx.getSymbol())
                        .quantity(0)
                        .avgPrice(0.0)
                        .build());


        if ("BUY".equalsIgnoreCase(tx.getType())) {
            int newQty = holding.getQuantity() + tx.getQuantity();
            double totalCost = (holding.getAvgPrice() * holding.getQuantity()) + (tx.getPrice() * tx.getQuantity());
            double newAvg = newQty == 0 ? 0.0 : totalCost / newQty;
            holding.setQuantity(newQty);
            holding.setAvgPrice(newAvg);
        }

        else if ("SELL".equalsIgnoreCase(tx.getType())) {
            int newQty = Math.max(0, holding.getQuantity() - tx.getQuantity());
            holding.setQuantity(newQty);
            if (newQty == 0) holding.setAvgPrice(0.0);
        }

        holdingRepository.save(holding);
        return saved;
    }

    public List<Holding> getHoldings(Long userId) {
        return holdingRepository.findByUserId(userId);
    }

    public List<Transaction> getTransactions(Long userId) {
        return transactionRepository.findByUserId(userId);
    }
}
