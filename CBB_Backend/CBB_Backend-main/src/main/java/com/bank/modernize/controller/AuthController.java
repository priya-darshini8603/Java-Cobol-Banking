package com.bank.modernize.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bank.modernize.dto.*;
import com.bank.modernize.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Date;
import com.bank.modernize.security.JwtUtil;
import com.bank.modernize.security.RevokedTokenService;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService service;
    private final JwtUtil jwtUtil;
    private final RevokedTokenService revokedTokenService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        try {
            String role = service.register(req);
            return ResponseEntity.ok(role);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

 
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            return ResponseEntity.ok(service.login(req));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpRequest req) {
        try {
            return ResponseEntity.ok(service.verifyOtp(req));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest req) {
        try {
            return ResponseEntity.ok(
                    service.sendResetOtp(req.getEmail())
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

 
    @PostMapping("/reset-password-otp")
    public ResponseEntity<?> resetPasswordOtp(@RequestBody ResetPasswordOtpRequest req) {
        try {
            service.resetPasswordByOtp(
                    req.getEmail(),
                    req.getOtp(),
                    req.getNewPassword()
            );
            return ResponseEntity.ok("PASSWORD_RESET_SUCCESS");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/verify-reset-otp")
    public ResponseEntity<?> verifyResetOtp(@RequestBody OtpRequest req) {
        try {
            return ResponseEntity.ok(
                    service.verifyResetOtp(req.getEmail(), req.getOtp())
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {

        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer "))
            return ResponseEntity.badRequest().body("TOKEN_MISSING");

        String token = header.substring(7);

        Date expiry = jwtUtil.extractExpiration(token);
        revokedTokenService.revokeToken(token, expiry.getTime());

        return ResponseEntity.ok("LOGOUT_SUCCESS");
    }
}