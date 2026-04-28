package com.bank.modernize.entity;

import jakarta.persistence.*;
import lombok.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.bank.modernize.enums.Role;
import com.bank.modernize.enums.Status;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @NotBlank
    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Email
    @NotBlank
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    @Column(nullable = false)
    private String phone;

    @NotBlank
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @NotNull
    private Role role;

    @Enumerated(EnumType.STRING)
    @NotNull
    private Status status;

    @Column(name = "mfa_enabled", nullable = false)
    private Boolean mfaEnabled = false;
    
    @Column(name = "reset_otp")
    private String resetOtp;

    private LocalDateTime resetOtpExpiry;

    @Column(name = "otp_code")
    private String otpCode;

    private LocalDateTime otpExpiry;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
