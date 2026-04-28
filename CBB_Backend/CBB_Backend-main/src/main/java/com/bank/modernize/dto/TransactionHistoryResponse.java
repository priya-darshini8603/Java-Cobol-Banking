package com.bank.modernize.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TransactionHistoryResponse {
    private Long transactionId;
    private LocalDateTime date;
    private String userName;
    private String type;
    private Long accountNumber;
    private BigDecimal amount;
    private String status;
}
