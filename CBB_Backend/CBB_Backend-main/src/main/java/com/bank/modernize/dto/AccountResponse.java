package com.bank.modernize.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.bank.modernize.enums.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AccountResponse {

    private Long accountId;
    private Long customerId;
    private Long accountNumber;
    private AccountType accountType;
    private BigDecimal balance;
    private AccountStatus status;
    private LocalDateTime createdAt;
}
