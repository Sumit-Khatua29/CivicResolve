package com.example.CivicResolve.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Async
    public void sendStatusUpdateEmail(String recepientEmail, Integer issueId, String newStatus){
        try{
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(senderEmail);
            message.setTo(recepientEmail);
            message.setSubject("Issue Status Update");
            message.setText("The status of your issue with ID " + issueId + " has been updated to " + newStatus);
            javaMailSender.send(message);
            // System.out.println("Email sent to " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
}
