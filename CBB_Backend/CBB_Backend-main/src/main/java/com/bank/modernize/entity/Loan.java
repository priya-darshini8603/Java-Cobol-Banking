package com.bank.modernize.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.bank.modernize.enums.LoanStatus;
import com.bank.modernize.enums.LoanType;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.hibernate.annotations.CreationTimestamp;

@Builder
@Entity
@Table(name = "loans")
@Data
@NoArgsConstructor   
@AllArgsConstructor
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "loan_id")
    private Long loanId;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    @NotNull
    private User customer;

    @Column(name = "salary", nullable = false, precision = 12, scale = 2)
    private BigDecimal salary;

    @Column(name = "credit_score", nullable = false)
    private Integer creditScore;

    @Column(name = "loan_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal loanAmount;

    @Column(name = "tenure_months", nullable = false)
    private Integer tenureMonths;  // REQUIRED for EMI

    @Enumerated(EnumType.STRING)
    @Column(name = "loan_type", nullable = false)
    private LoanType loanType;

    @Column(name = "annual_interest_rate", precision = 5, scale = 2)
    private BigDecimal annualInterestRate;  

    @Column(name = "emi", precision = 12, scale = 2)
    private BigDecimal emi; 

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private LoanStatus status = LoanStatus.PENDING;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
