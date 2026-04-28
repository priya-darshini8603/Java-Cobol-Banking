package com.bank.modernize.adapter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com.bank.modernize.dto.EmiResult;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.TimeUnit;
import java.util.List;

@Service
@Slf4j
public class CobolAdapter {

    private static final String PATH = "C:/cobol/";
    private static final int TIMEOUT_MS = 5000;

    private String runProcess(String exe, String... params) {
        try {
            String[] cmd = new String[params.length + 1];
            cmd[0] = PATH + exe;
            System.arraycopy(params, 0, cmd, 1, params.length);

            ProcessBuilder pb = new ProcessBuilder(cmd);
            pb.redirectErrorStream(true);

            Process process = pb.start();

            boolean finished = process.waitFor(TIMEOUT_MS, TimeUnit.MILLISECONDS);
            if (!finished) {
                process.destroyForcibly();
                throw new RuntimeException("COBOL timeout");
            }

            if (process.exitValue() != 0) {
                throw new RuntimeException("COBOL failed with exit code " + process.exitValue());
            }

            BufferedReader br = new BufferedReader(
                    new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8));

            String result = br.readLine();
            log.info("COBOL [{}] -> {}", exe, result);

            if (result == null || result.trim().isEmpty()) {
                throw new RuntimeException("COBOL returned empty result");
            }

            return result.trim();

        } catch (Exception e) {
            log.error("COBOL execution error", e);
            throw new RuntimeException("COBOL execution failed");
        }
    }


    public double calculateDeposit(double bal, double amount) {
        String res = runProcess("Deposit.exe", scale(bal), scale(amount));

        handleCommonErrors(res);
        return parseAmount(res);
    }


    public double calculateWithdraw(double balance, double amount) {
        String res = runProcess("Withdraw.exe", scale(balance), scale(amount));

        handleCommonErrors(res);
        return parseAmount(res);
    }


    public double[] calculateTransfer(double fbal, double tbal, double amt) {
        String res = runProcess("Transfer.exe",
        		scale(fbal), scale(tbal), scale(amt));

        handleCommonErrors(res);

        String[] parts = res.split("\\s+");
        if (parts.length != 2)
            throw new RuntimeException("Invalid transfer response from COBOL");

        return new double[]{
                parseAmount(parts[0]),
                parseAmount(parts[1])
        };
    }
    private String scale(double val) {
        return String.valueOf((long) (val * 100));
    }

    public double calculateTotalBalance(List<Long> balances) {

        if (balances == null || balances.isEmpty())
            throw new RuntimeException("Customer has no accounts");

        String[] args = new String[balances.size()];

        for (int i = 0; i < balances.size(); i++) {
            args[i] = String.valueOf(balances.get(i));
        }

        String res = runProcess("TotalBal.exe", args);

        handleCommonErrors(res);

        return parseAmount(res);
    }

    public double calculateInterestRate(int creditScore) {
        String res = runProcess("InterestRate.exe", String.valueOf(creditScore));

        try {
            return Double.parseDouble(res.trim());
        } catch (Exception e) {
            throw new RuntimeException("Invalid rate from COBOL: " + res);
        }
    }

    public EmiResult calculateEmi(double loanAmount, double annualRate, int months) {

        String res = runProcess("EmiCalc.exe",
                scale(loanAmount),
                String.valueOf(annualRate),
                String.valueOf(months));

        if ("INVALID".equalsIgnoreCase(res))
            throw new RuntimeException("Invalid EMI calculation input");

        String[] parts = res.trim().split("\\s+");

        if (parts.length != 3)
            throw new RuntimeException("Invalid EMI response from COBOL: " + res);

        double emi = parseAmount(parts[0]);
        double totalPayment = parseAmount(parts[1]);
        double totalInterest = parseAmount(parts[2]);

        return new EmiResult(emi, totalPayment, totalInterest);
    }

    
    private void handleCommonErrors(String res) {
        if ("INVALID".equalsIgnoreCase(res))
            throw new RuntimeException("Invalid input amount");

        if ("FAILED".equalsIgnoreCase(res))
            throw new RuntimeException("Insufficient funds");
    }


    private double parseAmount(String val) {
        try {
        	return Double.parseDouble(val.trim()) / 100.0;
        } catch (Exception e) {
            throw new RuntimeException("Invalid numeric response from COBOL: " + val);
        }
    }
   
}