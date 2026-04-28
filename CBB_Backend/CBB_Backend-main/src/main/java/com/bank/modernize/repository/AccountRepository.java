package com.bank.modernize.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bank.modernize.entity.Account;
import com.bank.modernize.entity.User;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    boolean existsByAccountNumber(Long accountNumber);

    List<Account> findByCustomerUserId(Long userId);

    boolean existsById(Long accountId);

    Optional<Account> findByCustomer(User customer);

    Optional<Account> findByAccountNumber(Long accountNumber);

    // DELETE ALL ACCOUNTS OF USER
    @Modifying
    @Query("DELETE FROM Account a WHERE a.customer.userId = :userId")
    void deleteByCustomerId(@Param("userId") Long userId);
}