package com.bank.modernize.service;

import com.bank.modernize.adapter.CobolAdapter;
import com.bank.modernize.entity.*;
import com.bank.modernize.enums.LoanStatus;
import com.bank.modernize.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmiPaymentService {

    private final LoanRepository loanRepository;
    private final EmiPaymentRepository emiPaymentRepository;
    private final AccountRepository accountRepository;
    private final CobolAdapter cobol;

    @Transactional
    public void payEmi(Long loanId, Long accountId) {

        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (loan.getStatus() != LoanStatus.APPROVED)
            throw new RuntimeException("Loan not approved");

        long paidCount = emiPaymentRepository.countByLoan(loan);
        if (paidCount >= loan.getTenureMonths())
            throw new RuntimeException("Loan already fully paid");

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (!account.getCustomer().getUserId()
                .equals(loan.getCustomer().getUserId())) {
            throw new RuntimeException("Account does not belong to this customer");
        }

        BigDecimal emi = loan.getEmi();

        if (account.getBalance().compareTo(emi) < 0)
            throw new RuntimeException("Insufficient balance");

        double newBalance = cobol.calculateWithdraw(
                account.getBalance().doubleValue(),
                emi.doubleValue()
        );

        account.setBalance(BigDecimal.valueOf(newBalance));
        accountRepository.save(account);

        EmiPayment payment = EmiPayment.builder()
                .loan(loan)
                .amount(emi)
                .paidAt(LocalDateTime.now())
                .build();

        emiPaymentRepository.save(payment);
    }

    public BigDecimal getTotalPaid(Loan loan) {
        List<EmiPayment> payments = emiPaymentRepository.findByLoan(loan);

        return payments.stream()
                .map(EmiPayment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
