package com.bank.modernize.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.bank.modernize.dto.LoanRequest;
import com.bank.modernize.dto.LoanResponse;
import com.bank.modernize.entity.User;
import com.bank.modernize.repository.UserRepository;
import com.bank.modernize.service.LoanService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;
    private final UserRepository userRepo;

    @PostMapping("/apply")
    public ResponseEntity<LoanResponse> applyLoan(@RequestBody LoanRequest request){
        return new ResponseEntity<>(loanService.applyLoan(request), HttpStatus.CREATED);
    }

    @PutMapping("/{loanId}/approve")
    public ResponseEntity<LoanResponse> approveLoan(@PathVariable Long loanId) {
        return ResponseEntity.ok(loanService.approveLoan(loanId));
    }

    @PutMapping("/{loanId}/reject")
    public ResponseEntity<LoanResponse> rejectLoan(@PathVariable Long loanId) {
        return ResponseEntity.ok(loanService.rejectLoan(loanId));
    }

    @GetMapping("/customer")
    public ResponseEntity<List<LoanResponse>> getMyLoans(
            org.springframework.security.core.Authentication auth) {

        String email = auth.getName();  

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));

        return ResponseEntity.ok(
                loanService.getLoansByCustomer(user.getUserId()));
    }
    
    @GetMapping("/admin/pending")
    public ResponseEntity<List<LoanResponse>> getPendingLoans() {
        return ResponseEntity.ok(loanService.getPendingLoans());
    }

    @GetMapping("/{loanId}")
    public ResponseEntity<LoanResponse> getLoanById(@PathVariable Long loanId) {
        return ResponseEntity.ok(loanService.getLoanById(loanId));
    }
}
