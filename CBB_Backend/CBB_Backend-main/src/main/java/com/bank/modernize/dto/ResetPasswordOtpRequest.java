package com.bank.modernize.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResetPasswordOtpRequest {
    private String email;
    private String otp;
    private String newPassword;
}