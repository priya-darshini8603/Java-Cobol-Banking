package com.bank.modernize.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.bank.modernize.adapter.CobolAdapter;
import com.bank.modernize.dto.EmiResult;
import com.bank.modernize.dto.LoanRequest;
import com.bank.modernize.dto.LoanResponse;
import com.bank.modernize.entity.Loan;
import com.bank.modernize.entity.User;
import com.bank.modernize.enums.LoanStatus;
import com.bank.modernize.enums.LoanType;
import com.bank.modernize.repository.EmiPaymentRepository;
import com.bank.modernize.repository.LoanRepository;
import com.bank.modernize.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LoanService {

    private final LoanRepository loanRepository;
    private final UserRepository userRepo;
    private final CobolAdapter cobol;

    private final EmiPaymentService emiPaymentService;
    private final EmiPaymentRepository emiPaymentRepository;


    @Transactional
    public LoanResponse applyLoan(LoanRequest dto) {

    	String email = SecurityContextHolder.getContext()
    	        .getAuthentication()
    	        .getName();

    	User user = userRepo.findByEmail(email)
    	        .orElseThrow(() -> new RuntimeException("Customer not found"));


        double rate = cobol.calculateInterestRate(dto.getCreditScore());

        EmiResult emiResult = cobol.calculateEmi(
                dto.getLoanAmount().doubleValue(),
                rate,
                dto.getTenureMonths()
        );


        Loan loan = Loan.builder()
                .customer(user)
                .salary(dto.getSalary())
                .loanAmount(dto.getLoanAmount())
                .creditScore(dto.getCreditScore())
                .loanType(LoanType.valueOf(dto.getLoanType()))
                .tenureMonths(dto.getTenureMonths())
                .annualInterestRate(BigDecimal.valueOf(rate))
                .emi(BigDecimal.valueOf(emiResult.getEmi()))
                .status(LoanStatus.PENDING) 
                .build();

        return mapToResponse(loanRepository.save(loan));
    }

    public LoanResponse approveLoan(Long loanId) {
        Loan loan = getLoanEntity(loanId);
        loan.setStatus(LoanStatus.APPROVED);
        return mapToResponse(loanRepository.save(loan));
    }

    public LoanResponse rejectLoan(Long loanId) {
        Loan loan = getLoanEntity(loanId);
        loan.setStatus(LoanStatus.REJECTED);
        return mapToResponse(loanRepository.save(loan));
    }

    public List<LoanResponse> getLoansByCustomer(Long customerId) {
        return loanRepository.findByCustomerUserId(customerId) 
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public LoanResponse getLoanById(Long loanId) {
        return mapToResponse(getLoanEntity(loanId));
    }

    private Loan getLoanEntity(Long loanId) {
        return loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found: " + loanId));
    }
    
    public List<LoanResponse> getPendingLoans() {
        return loanRepository.findByStatus(LoanStatus.PENDING)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private LoanResponse mapToResponse(Loan loan) {

        LoanResponse res = new LoanResponse();

        res.setLoanId(loan.getLoanId());
        res.setCustomerId(loan.getCustomer().getUserId());
        res.setSalary(loan.getSalary());
        res.setLoanAmount(loan.getLoanAmount());
        res.setCreditScore(loan.getCreditScore());
        res.setLoanType(loan.getLoanType());
        res.setEmi(loan.getEmi());
        res.setAnnualInterestRate(loan.getAnnualInterestRate());
        res.setTenureMonths(loan.getTenureMonths());
        res.setStatus(loan.getStatus());
        res.setCreatedAt(loan.getCreatedAt());

        BigDecimal totalRepayment =
                loan.getEmi().multiply(BigDecimal.valueOf(loan.getTenureMonths()));

        BigDecimal totalPaid = emiPaymentService.getTotalPaid(loan);
        
        BigDecimal remainingBalance =
                totalRepayment.subtract(totalPaid);

        BigDecimal totalInterest =
                totalRepayment.subtract(loan.getLoanAmount());

        long paidCount = emiPaymentRepository.countByLoan(loan);
        int remainingMonths = loan.getTenureMonths() - (int) paidCount;

        res.setTotalPaid(totalPaid);
        res.setTotalRepayment(totalRepayment);
        res.setTotalInterest(totalInterest);
        res.setRemainingBalance(remainingBalance);
        res.setRemainingMonths(remainingMonths);

        return res;
    }

}