package com.bank.modernize.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.Collections;

import org.springframework.stereotype.Service;

import com.bank.modernize.dto.TransactionHistoryResponse;
import com.bank.modernize.dto.TransactionResponse;
import com.bank.modernize.entity.Account;
import com.bank.modernize.entity.Transaction;
import com.bank.modernize.entity.User;
import com.bank.modernize.repository.AccountRepository;
import com.bank.modernize.repository.TransactionRepository;
import com.bank.modernize.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final AccountRepository accountRepo;
    private final TransactionRepository transactionRepo;
    private final UserRepository userRepo;

    
    public List<TransactionResponse> getCustomerTransactionsByEmail(String email) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return getCustomerTransactions(user.getUserId());
    }


    public List<TransactionResponse> getCustomerTransactions(Long userId) {

        List<Account> accounts = accountRepo.findByCustomerUserId(userId);

        List<Long> accountIds = new ArrayList<>();
        for (Account acc : accounts) {
            accountIds.add(acc.getAccountId());
        }

        List<Transaction> allTxns = new ArrayList<>();
        allTxns.addAll(transactionRepo.findByFromAccount_AccountIdIn(accountIds));
        allTxns.addAll(transactionRepo.findByToAccount_AccountIdIn(accountIds));

        Set<Long> seen = new HashSet<>();
        List<Transaction> uniqueTxns = new ArrayList<>();
        for (Transaction t : allTxns) {
            if (seen.add(t.getTxnId())) {
                uniqueTxns.add(t);
            }
        }

        Collections.sort(uniqueTxns, (a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));

        List<TransactionResponse> response = new ArrayList<>();

        for (Transaction txn : uniqueTxns) {

            Long accountNumber;

            if (accountIds.contains(txn.getFromAccount().getAccountId())) {
                accountNumber = txn.getFromAccount().getAccountNumber();
            } else {
                accountNumber = txn.getToAccount().getAccountNumber();
            }

            response.add(new TransactionResponse(
                    txn.getTxnId(),
                    txn.getCreatedAt().toLocalDate().toString(),
                    txn.getTxnType().name(),
                    accountNumber,
                    txn.getAmount(),
                    txn.getStatus().name()
            ));
        }

        return response;
    }
    
    public List<TransactionHistoryResponse> getAllTransactions() {

        return transactionRepo.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(txn -> new TransactionHistoryResponse(
                        txn.getTxnId(),
                        txn.getCreatedAt(),
                        txn.getFromAccount().getCustomer().getFullName(),
                        txn.getTxnType().name(),
                        txn.getFromAccount().getAccountNumber(),
                        txn.getAmount(),
                        txn.getStatus().name()
                ))
                .toList();
    }
}
