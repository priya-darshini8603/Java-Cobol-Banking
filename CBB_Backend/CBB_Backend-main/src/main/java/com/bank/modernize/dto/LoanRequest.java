package com.bank.modernize.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoanRequest {      
    private BigDecimal salary;      
    private BigDecimal loanAmount;  
    private Integer creditScore;    
    private Integer tenureMonths;  
    private String loanType;        
}

