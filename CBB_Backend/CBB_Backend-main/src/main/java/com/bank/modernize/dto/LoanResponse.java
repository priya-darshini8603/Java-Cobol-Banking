package com.bank.modernize.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.bank.modernize.enums.LoanStatus;
import com.bank.modernize.enums.LoanType;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoanResponse {
    private Long loanId;
    private Long customerId;
    private BigDecimal salary;
    private BigDecimal loanAmount;
    private Integer creditScore;
    private LoanType loanType;
    private Integer tenureMonths;
    private BigDecimal emi;
    private BigDecimal annualInterestRate; 
    private LoanStatus status;
    private LocalDateTime createdAt;
    private BigDecimal totalInterest;
    private BigDecimal totalRepayment;
    private BigDecimal totalPaid;
    private BigDecimal remainingBalance;
    private Integer remainingMonths;

}


