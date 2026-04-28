package com.bank.modernize.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bank.modernize.entity.Loan;
import com.bank.modernize.enums.LoanStatus;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {

    List<Loan> findByCustomerUserId(Long userId);

    long countByStatus(LoanStatus status);

    List<Loan> findByStatus(LoanStatus status);

    // DELETE ALL LOANS OF USER
    @Modifying
    @Query("DELETE FROM Loan l WHERE l.customer.userId = :userId")
    void deleteByCustomerId(@Param("userId") Long userId);
}