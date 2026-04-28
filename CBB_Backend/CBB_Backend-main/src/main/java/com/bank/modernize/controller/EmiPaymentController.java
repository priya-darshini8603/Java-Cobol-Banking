package com.bank.modernize.controller;

import com.bank.modernize.service.EmiPaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
public class EmiPaymentController {

    private final EmiPaymentService emiPaymentService;

    @PostMapping("/{loanId}/pay-emi")
    public ResponseEntity<String> payEmi(@PathVariable Long loanId, @RequestParam Long accountId) {
        emiPaymentService.payEmi(loanId, accountId);
        return ResponseEntity.ok("EMI paid successfully");
    }

}
