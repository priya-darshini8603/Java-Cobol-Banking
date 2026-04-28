package com.bank.modernize.controller;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bank.modernize.dto.AccountResponse;
import com.bank.modernize.dto.CreateUserRequest;
import com.bank.modernize.dto.UpdateUserRequest;
import com.bank.modernize.dto.UserResponse;
import com.bank.modernize.service.AccountService;
import com.bank.modernize.service.UserService;

import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final AccountService accountService;

    @PostMapping("/create")
    public ResponseEntity<UserResponse> createUser(
            @RequestBody CreateUserRequest request) {

        UserResponse response = userService.createUser(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
    @GetMapping("/{userId}/accounts")
    public ResponseEntity<List<AccountResponse>> getAccountsByUserId(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                accountService.getAccountsByCustomerId(userId)
        );
    }
    
    @PutMapping("/{userId}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long userId,
            @RequestBody UpdateUserRequest request) {

        return ResponseEntity.ok(
                userService.updateUser(userId, request));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.deleteUser(id));
    }
    
}
