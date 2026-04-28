package com.bank.modernize.dto;

import java.math.BigDecimal;
import com.bank.modernize.enums.AccountType;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateAccountRequest {

    @NotNull
    private Long customerId;

    @NotNull
    private AccountType accountType;

    @NotNull
    @DecimalMin(value = "500.0", message = "Minimum deposit is 500")
    private BigDecimal initialDeposit;
}
