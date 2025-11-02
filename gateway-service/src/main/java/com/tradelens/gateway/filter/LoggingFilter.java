package com.tradelens.gateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class LoggingFilter implements GatewayFilter, Ordered {

    private static final Logger log = LoggerFactory.getLogger(LoggingFilter.class);

    @Override
    public int getOrder() {
        return -1; // run early
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        // ✅ Get HTTP method safely for Spring Boot 3.x
        HttpMethod httpMethod = exchange.getRequest().getMethod();
        String method = (httpMethod != null) ? httpMethod.name() : "UNKNOWN";

        // ✅ Get path and Authorization header
        String path = exchange.getRequest().getURI().getPath();
        String auth = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

        log.info("[GATEWAY] {} {}", method, path);
        if (auth != null) {
            log.debug("[GATEWAY] Authorization header present, forwarding to downstream");
        } else {
            log.debug("[GATEWAY] No Authorization header for request");
        }

        // continue the chain
        return chain.filter(exchange);
    }
}
