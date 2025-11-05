package com.tradelens.gateway.config;

import com.tradelens.gateway.filter.LoggingFilter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRoutes(RouteLocatorBuilder builder, LoggingFilter loggingFilter) {
        return builder.routes()

                // 🧩 AUTH-SERVICE (Port 8081)
                .route("auth_route", r -> r.path("/auth/**")
                        .filters(f -> f.filter(loggingFilter))
                        .uri("http://localhost:8081"))

                // 💼 PORTFOLIO-SERVICE (Port 8082)
                .route("portfolio_route", r -> r.path("/portfolio/**")
                        .filters(f -> f.filter(loggingFilter))
                        .uri("http://localhost:8082"))

                // 📊 MARKETDATA-SERVICE (Port 8083)
                .route("marketdata_route", r -> r.path("/marketdata/**")
                        .filters(f -> f.filter(loggingFilter))
                        .uri("http://localhost:8083"))

                // 📈 ANALYTICS-SERVICE (Port 8084)
                .route("analytics_route", r -> r.path("/analytics/**")
                        .filters(f -> f.filter(loggingFilter))
                        .uri("http://localhost:8084"))

                // 🛰️ ANALYTICS WEBSOCKET (Forward ws://localhost:8080/analytics/stream → ws://localhost:8084/analytics/stream)
                .route("analytics_ws_route", r -> r.path("/analytics/stream/**")
                        .uri("ws://localhost:8084"))

                .build();
    }
}
