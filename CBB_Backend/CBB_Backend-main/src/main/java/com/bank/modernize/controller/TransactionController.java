package com.bank.modernize.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bank.modernize.dto.TransactionHistoryResponse;
import com.bank.modernize.dto.TransactionResponse;
import com.bank.modernize.service.TransactionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class TransactionController {
	
	private final TransactionService transactionService;
	
	@GetMapping("/my-transactions")
	public List<TransactionResponse> myHistory(
	        org.springframework.security.core.Authentication auth) {

	    String email = auth.getName(); 
	    return transactionService.getCustomerTransactionsByEmail(email);
	}
	
    @GetMapping("/history")
    public ResponseEntity<List<TransactionHistoryResponse>> getallHistory() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }

}
