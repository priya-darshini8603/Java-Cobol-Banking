package com.bank.modernize.dto;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TransferRequest {
    private Long fromAccountNumber;
    private Long toAccountNumber;
    private double amount;
}
