package com.bank.modernize.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.bank.modernize.entity.Transaction;
import com.bank.modernize.enums.TxnStatus;
import com.bank.modernize.enums.TxnType;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // ================= FIND METHODS =================
    List<Transaction> findByFromAccount_AccountIdIn(List<Long> ids);

    List<Transaction> findByToAccount_AccountIdIn(List<Long> ids);

    boolean existsByFromAccount_AccountId(Long accountId);

    boolean existsByToAccount_AccountId(Long accountId);

    long countByStatus(TxnStatus status);

    List<Transaction> findByStatusAndTxnType(TxnStatus status, TxnType txnType);

    List<Transaction> findAllByOrderByCreatedAtDesc();

    // ================= TOTAL REVENUE =================
    @Query("""
           SELECT COALESCE(SUM(t.amount),0)
           FROM Transaction t
           WHERE t.txnType = com.bank.modernize.enums.TxnType.DEPOSIT
           """)
    Double getTotalRevenue();

    // ================= TODAY TRANSACTIONS =================
    @Query("""
           SELECT COUNT(t)
           FROM Transaction t
           WHERE DATE(t.createdAt) = CURRENT_DATE
           """)
    long countTodayTransactions();

    // ================= MONTHLY TRANSACTIONS (BAR CHART) =================
    @Query(value = """
            SELECT DAY(created_at) AS day, COUNT(*) AS total
            FROM transactions
            WHERE MONTH(created_at) = MONTH(CURRENT_DATE())
              AND YEAR(created_at) = YEAR(CURRENT_DATE())
            GROUP BY DAY(created_at)
            ORDER BY DAY(created_at)
            """, nativeQuery = true)
    List<Object[]> getMonthlyTransactionStats();

    // ================= DELETE ALL USER TRANSACTIONS =================
    @Modifying
    @Query(value = """
    DELETE FROM transactions
    WHERE from_acc_id IN (
        SELECT account_id FROM accounts WHERE customer_id = :userId
    )
    OR to_acc_id IN (
        SELECT account_id FROM accounts WHERE customer_id = :userId
    )
    """, nativeQuery = true)
    void deleteByUserId(Long userId);
}