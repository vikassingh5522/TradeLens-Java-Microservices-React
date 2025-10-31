package com.tradelens.marketdata.repository;

import com.tradelens.marketdata.model.PriceSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PriceSnapshotRepository extends JpaRepository<PriceSnapshot, Long> {
}
