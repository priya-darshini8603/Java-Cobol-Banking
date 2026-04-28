package com.bank.modernize.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmiResult {
    private double emi;
    private double totalPayment;
    private double totalInterest;
}
