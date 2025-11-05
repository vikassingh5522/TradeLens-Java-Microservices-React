package com.tradelens.analytics.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // ✅ Enable simple broker for subscriptions (frontend subscribes to /topic)
        config.enableSimpleBroker("/topic");

        // ✅ Prefix for client → server messages (@MessageMapping endpoints)
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // ✅ WebSocket endpoint that Gateway proxies at ws://localhost:8080/analytics/stream
        registry.addEndpoint("/stream")
                .setAllowedOriginPatterns("*")
                .withSockJS(); // enables SockJS fallback
    }
}
