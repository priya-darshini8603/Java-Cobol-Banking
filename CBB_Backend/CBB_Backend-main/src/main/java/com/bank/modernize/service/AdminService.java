package com.bank.modernize.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bank.modernize.entity.User;
import com.bank.modernize.enums.LoanStatus;
import com.bank.modernize.enums.Role;
import com.bank.modernize.repository.AccountRepository;
import com.bank.modernize.repository.LoanRepository;
import com.bank.modernize.repository.TransactionRepository;
import com.bank.modernize.repository.UserRepository;
import com.bank.modernize.repository.EmiPaymentRepository;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminService {

    private final UserRepository userRepo;
    private final LoanRepository loanRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final EmiPaymentRepository emiPaymentRepository;

    public long getTotalUsers() {
        return userRepo.count();
    }

    public long getPendingLoans() {
        return loanRepository.countByStatus(LoanStatus.PENDING);
    }

    public long countLoansByStatus(LoanStatus status) {
        return loanRepository.countByStatus(status);
    }

    public String deleteUser(Long userId) {

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == Role.ADMIN) {
            throw new RuntimeException("Admin cannot be deleted");
        }

        String name = user.getFullName();

        emiPaymentRepository.deleteByUserId(userId);

        transactionRepository.deleteByUserId(userId);

        loanRepository.deleteByCustomerId(userId);

        accountRepository.deleteByCustomerId(userId);

        userRepo.deleteById(userId);

        return name + " deleted successfully";
    }
}