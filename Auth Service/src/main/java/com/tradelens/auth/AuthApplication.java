package com.tradelens.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(
        excludeName = {
                "org.springframework.ai.autoconfigure.vectorstore.redis.RedisVectorStoreAutoConfiguration",
                "org.springframework.ai.autoconfigure.embedding.EmbeddingAutoConfiguration"
        }
)
public class AuthApplication {
    public static void main(String[] args) {
        SpringApplication.run(AuthApplication.class, args);
        System.out.println("🚀 Auth-Service started successfully on port 8081 (MySQL + JWT)");
    }
}
