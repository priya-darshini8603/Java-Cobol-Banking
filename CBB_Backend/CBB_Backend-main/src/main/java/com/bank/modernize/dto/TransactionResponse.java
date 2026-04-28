package com.bank.modernize.dto;

import java.math.BigDecimal;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {
    private Long transactionId;
    private String date;
    private String type;
    private Long account;
    private BigDecimal amount;
    private String status;
}
