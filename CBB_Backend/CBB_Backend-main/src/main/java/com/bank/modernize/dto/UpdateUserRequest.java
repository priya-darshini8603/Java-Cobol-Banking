package com.bank.modernize.dto;

import com.bank.modernize.enums.Status;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {

    private String fullName;
    private String phone;
    private Status status;        
    private Boolean mfaEnabled;   
}
