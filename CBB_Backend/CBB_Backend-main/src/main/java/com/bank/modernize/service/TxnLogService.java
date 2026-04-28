package com.bank.modernize.service;

import com.bank.modernize.entity.Transaction;
import com.bank.modernize.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TxnLogService {

    private final TransactionRepository txnRepo;

    @Transactional(Transactional.TxType.REQUIRES_NEW)
    public Transaction save(Transaction txn) {
        return txnRepo.save(txn);
    }
}
