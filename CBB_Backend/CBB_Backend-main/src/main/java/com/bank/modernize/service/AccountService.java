package com.bank.modernize.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.bank.modernize.dto.AccountResponse;
import com.bank.modernize.dto.CreateAccountRequest;
import com.bank.modernize.entity.Account;
import com.bank.modernize.entity.User;
import com.bank.modernize.enums.AccountStatus;
import com.bank.modernize.enums.Status;
import com.bank.modernize.repository.AccountRepository;
import com.bank.modernize.repository.TransactionRepository;
import com.bank.modernize.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepo;
    private final UserRepository userRepo;
    private final TransactionRepository transactionRepo;

    @Transactional
    public AccountResponse createAccountForLoggedInUser(CreateAccountRequest request, String email) {

        User customer = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"));

        if (customer.getStatus() != Status.ACTIVE) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Customer is inactive");
        }

        if (request.getAccountType() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Account type required");
        }

        BigDecimal deposit = request.getInitialDeposit();
        if (deposit == null || deposit.compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid initial deposit");
        }

        Long accountNumber = generateAccountNumber();

        Account acc = new Account();
        acc.setCustomer(customer);
        acc.setAccountNumber(accountNumber);
        acc.setAccountType(request.getAccountType());
        acc.setBalance(deposit);
        acc.setStatus(AccountStatus.ACTIVE);

        accountRepo.save(acc);

        return mapToResponse(acc);
    }

    public AccountResponse getAccountById(Long accountId) {

        Account acc = accountRepo.findById(accountId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Account not found"));

        return mapToResponse(acc);
    }

    public List<AccountResponse> getAllAccounts() {
        return accountRepo.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AccountResponse> getAccountsByCustomerId(Long customerId) {

        if (!userRepo.existsById(customerId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Customer not found");
        }

        return accountRepo.findByCustomerUserId(customerId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteAccountById(Long accountId) {

        Account account = accountRepo.findById(accountId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Account not found"));

        boolean hasTxn =
                transactionRepo.existsByFromAccount_AccountId(accountId);

        if (hasTxn) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Transactions exist for this account. Cannot delete.");
        }

        accountRepo.delete(account);
    }

    @Transactional
    public void deleteAccountsByCustomerId(Long customerId) {

        if (!userRepo.existsById(customerId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Customer not found");
        }

        accountRepo.deleteByCustomerId(customerId);
    }

    private AccountResponse mapToResponse(Account acc) {

        AccountResponse res = new AccountResponse();
        res.setAccountId(acc.getAccountId());
        res.setCustomerId(acc.getCustomer().getUserId());
        res.setAccountNumber(acc.getAccountNumber());
        res.setAccountType(acc.getAccountType());
        res.setBalance(acc.getBalance());
        res.setStatus(acc.getStatus());
        res.setCreatedAt(acc.getCreatedAt().toLocalDateTime());
        return res;
    }

    private Long generateAccountNumber() {

        Random r = new Random();
        Long number;

        do {
            number = 100000000000L + (long) (r.nextDouble() * 900000000000L);
        } while (accountRepo.existsByAccountNumber(number));

        return number;
    }

    public List<AccountResponse> getAccountsByEmail(String email) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"));

        return accountRepo.findByCustomerUserId(user.getUserId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
}