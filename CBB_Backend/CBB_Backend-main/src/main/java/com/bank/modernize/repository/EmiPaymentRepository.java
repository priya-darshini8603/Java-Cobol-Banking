package com.bank.modernize.repository;

import com.bank.modernize.entity.EmiPayment;
import com.bank.modernize.entity.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EmiPaymentRepository extends JpaRepository<EmiPayment, Long> {

    List<EmiPayment> findByLoan(Loan loan);

    long countByLoan(Loan loan);

    // DELETE EMI PAYMENTS OF USER (REQUIRED FOR CASCADE DELETE)
    @Modifying
    @Query(value = """
    DELETE FROM emi_payment
    WHERE loan_id IN (
        SELECT loan_id FROM loans WHERE customer_id = :userId
    )
    """, nativeQuery = true)
    void deleteByUserId(Long userId);
}