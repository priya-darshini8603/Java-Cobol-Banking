package com.bank.modernize.dto;
import com.bank.modernize.enums.Role;
import com.bank.modernize.enums.Status;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private Role role;
    private Status status;
    private boolean mfaEnabled;
}
