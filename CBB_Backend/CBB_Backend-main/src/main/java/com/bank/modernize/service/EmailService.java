package com.bank.modernize.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.MailException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendOtp(String email, String otp) {

        // Always print to console (for demo / fallback)
        System.out.println("OTP for " + email + " is: " + otp);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Your OTP Code");
            message.setText("Your OTP is: " + otp + "\nValid for 5 minutes.");

            mailSender.send(message);  
            System.out.println("Email sent successfully to " + email);

        } catch (MailException ex) {
            // If email is fake / not reachable,do NOT fail app
            System.out.println("Email sending failed. Using console OTP only.");
        }
    }

}