package com.bank.modernize.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Full name required")
    private String fullName;

    @Email(message = "Invalid email")
    @NotBlank(message = "Email required")
    private String email;

    @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be exactly 10 digits")
    private String phone;

    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
}