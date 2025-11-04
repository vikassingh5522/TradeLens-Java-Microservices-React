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

                //  Auth Service
                .route("auth_route", r -> r.path("/auth/**")
                        .filters(f -> f.filter(loggingFilter)) // keep as it is
                        .uri("http://localhost:8081"))

                // Portfolio Service
                .route("portfolio_route", r -> r.path("/portfolio/**")
                        .filters(f -> f.filter(loggingFilter)) // now forwards full /portfolio path
                        .uri("http://localhost:8082"))

                //  Market Data Service
                .route("marketdata_route", r -> r.path("/marketdata/**")
                        .filters(f -> f.filter(loggingFilter))
                        .uri("http://localhost:8083"))

                .build();
    }
}
