package com.tradelens.portfolio.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        final String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String requestURI = request.getRequestURI();

        System.out.println("🔍 [JwtFilter] Incoming request: " + request.getMethod() + " " + requestURI);

        if (header == null || !header.startsWith("Bearer ")) {
            System.out.println("⚠️ [JwtFilter] Missing or invalid Authorization header.");
            chain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);
        System.out.println("🪙 [JwtFilter] Extracted Token: " + token.substring(0, Math.min(30, token.length())) + "...");

        try {
            if (jwtUtils.validateToken(token)) {
                String subject = jwtUtils.extractSubject(token);
                System.out.println("✅ [JwtFilter] Token validated successfully for user: " + subject);

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                subject,
                                null,
                                List.of(new SimpleGrantedAuthority("ROLE_USER"))
                        );

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            } else {
                System.out.println("❌ [JwtFilter] Token validation failed.");
            }

        } catch (Exception e) {
            System.err.println("🚫 [JwtFilter] JWT Authentication failed: " + e.getMessage());
        }

        chain.doFilter(request, response);
    }
}
