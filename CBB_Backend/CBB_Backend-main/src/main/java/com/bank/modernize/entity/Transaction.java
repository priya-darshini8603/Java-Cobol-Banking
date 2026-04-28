package com.bank.modernize.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.bank.modernize.enums.TxnStatus;
import com.bank.modernize.enums.TxnType;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long txnId;

    @ManyToOne
    @JoinColumn(name = "from_acc_id", nullable = false)
    @NotNull
    private Account fromAccount;

    @ManyToOne
    @JoinColumn(name = "to_acc_id")
    private Account toAccount;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(name = "txn_type", nullable = false)
    private TxnType txnType;

    @NotNull
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @NotNull
    private TxnStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
