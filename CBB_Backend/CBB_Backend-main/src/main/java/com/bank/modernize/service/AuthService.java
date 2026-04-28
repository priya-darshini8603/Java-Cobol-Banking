package com.bank.modernize.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

import com.bank.modernize.dto.*;
import com.bank.modernize.entity.User;
import com.bank.modernize.enums.Role;
import com.bank.modernize.enums.Status;
import com.bank.modernize.repository.UserRepository;
import com.bank.modernize.security.JwtUtil;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository repo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    public String register(RegisterRequest req) {

        if (repo.findByEmail(req.getEmail()).isPresent())
            throw new RuntimeException("Email already exists");

        String email = req.getEmail().toLowerCase().trim();

        if (!email.contains("@") || email.split("@").length != 2)
            throw new RuntimeException("INVALID_EMAIL_FORMAT");

        String domain = email.split("@")[1];

        User user = new User();
        user.setFullName(req.getFullName());
        user.setEmail(email);
        user.setPhone(req.getPhone());
        user.setPassword(encoder.encode(req.getPassword()));

        if (domain.equals("gmail.com")) {
            user.setRole(Role.CUSTOMER);
        } else if (domain.equals("bank.com")) {
            user.setRole(Role.ADMIN);
        } else {
            throw new RuntimeException("INVALID_EMAIL_DOMAIN");
        }

        user.setStatus(Status.ACTIVE);
        user.setMfaEnabled(false);

        repo.save(user);

        return user.getRole().name();
    }


    public String login(LoginRequest req) {

        User user = repo.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("USER_NOT_FOUND"));

        if (!encoder.matches(req.getPassword(), user.getPassword()))
            throw new RuntimeException("INVALID_PASSWORD");

        // Restrict Admin Login to bank.com only
        if (user.getRole() == Role.ADMIN &&
            !user.getEmail().endsWith("@bank.com")) {
            throw new RuntimeException("INVALID_ADMIN_DOMAIN");
        }

        String otp = String.valueOf(new SecureRandom().nextInt(900000) + 100000);

        user.setOtpCode(encoder.encode(otp));
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        repo.save(user);

        emailService.sendOtp(user.getEmail(), otp);

        return "OTP_SENT";
    }


    public String verifyOtp(OtpRequest req) {

        User user = repo.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("USER_NOT_FOUND"));

        if (user.getOtpExpiry() == null ||
            user.getOtpExpiry().isBefore(LocalDateTime.now()))
            throw new RuntimeException("OTP_EXPIRED");

        if (!encoder.matches(req.getOtp(), user.getOtpCode()))
            throw new RuntimeException("INVALID_OTP");

        user.setOtpCode(null);
        user.setOtpExpiry(null);
        user.setMfaEnabled(true);
        repo.save(user);

        return jwtUtil.generateToken(user.getEmail(), user.getRole().name());
    }


    public String sendResetOtp(String email) {

        User user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("USER_NOT_FOUND"));

        String otp = String.valueOf(new SecureRandom().nextInt(900000) + 100000);

        user.setResetOtp(encoder.encode(otp));
        user.setResetOtpExpiry(LocalDateTime.now().plusMinutes(5));
        repo.save(user);

        emailService.sendOtp(user.getEmail(), otp);

        return "OTP_SENT";
    }


    public void resetPasswordByOtp(String email, String otp, String newPassword) {

        User user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("USER_NOT_FOUND"));

        if (user.getResetOtpExpiry() == null ||
            user.getResetOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP_EXPIRED");
        }

        if (!encoder.matches(otp, user.getResetOtp())) {
            throw new RuntimeException("INVALID_OTP");
        }

        user.setPassword(encoder.encode(newPassword));
        user.setResetOtp(null);
        user.setResetOtpExpiry(null);

        repo.save(user);
    }
    
    public String verifyResetOtp(String email, String otp) {

        User user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("USER_NOT_FOUND"));

        if (user.getResetOtpExpiry() == null ||
            user.getResetOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP_EXPIRED");
        }

        if (!encoder.matches(otp, user.getResetOtp())) {
            throw new RuntimeException("INVALID_OTP");
        }

        return "OTP_VERIFIED";
    }

}