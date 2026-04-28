package com.bank.modernize.entity;

import jakarta.persistence.*;
import lombok.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.sql.Timestamp;
import com.bank.modernize.enums.AccountStatus;
import com.bank.modernize.enums.AccountType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
@Entity
@Table(name = "accounts")
@Data
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "account_id")
    private Long accountId;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    @NotNull
    @JsonIgnoreProperties({"password","mfaSecret","createdAt","email","phone","role","status","mfaEnabled"})
    private User customer;

    @NotNull
    @Column(name = "account_number", nullable = false, unique = true)
    private Long accountNumber;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(name = "account_type", nullable = false)
    private AccountType accountType;

    @NotNull
    @Column(name = "balance", nullable = false)
    private BigDecimal balance;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(name = "status", nullable = false)
    private AccountStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Timestamp createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = new Timestamp(System.currentTimeMillis());
    }
}
