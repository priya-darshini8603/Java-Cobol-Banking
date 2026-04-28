package com.bank.modernize.dto;

import java.math.BigDecimal;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private long totalUsers;
    private long totalTransactions;
    private BigDecimal totalRevenue;  
    private long pendingLoans;
}

