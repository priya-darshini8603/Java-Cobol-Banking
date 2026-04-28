package com.bank.modernize.security;

import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RevokedTokenService {

    private final Map<String, Long> revokedTokens = new ConcurrentHashMap<>();

    public void revokeToken(String token, long expiryTime) {
        revokedTokens.put(token, expiryTime);
    }
    
    public boolean isRevoked(String token) {
        Long expiry = revokedTokens.get(token);

        if (expiry == null) return false;

        if (System.currentTimeMillis() > expiry) {
            revokedTokens.remove(token);
            return false;
        }

        return true;
    }
}
