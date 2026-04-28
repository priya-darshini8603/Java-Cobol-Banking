package com.bank.modernize.dto;

import com.bank.modernize.enums.Role;
import com.bank.modernize.enums.Status;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserRequest {

    private String fullName;
    private String email;
    private String phone;
    private String password;
    private Role role;         
    private Status status;     
    private boolean mfaEnabled; 
    private String mfaSecret;  
}