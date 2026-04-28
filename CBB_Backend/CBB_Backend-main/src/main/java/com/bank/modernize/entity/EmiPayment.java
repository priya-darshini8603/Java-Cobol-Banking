package com.bank.modernize.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "emi_payment")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmiPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "loan_id")
    private Loan loan;

    private BigDecimal amount;

    private LocalDateTime paidAt;
}
