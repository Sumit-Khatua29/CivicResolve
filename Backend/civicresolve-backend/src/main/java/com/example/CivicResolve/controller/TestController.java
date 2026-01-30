package com.example.CivicResolve.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private JavaMailSender mailSender;

    @GetMapping("/email")
    public ResponseEntity<String> sendTestEmail(@RequestParam String to) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("civicresolve5@gmail.com"); // Must match your configured email
            message.setTo(to);
            message.setSubject("Test Email from Civic Resolve (Sync)");
            message.setText("If you are reading this, your email configuration is WORKING!\n\nSent using Port 465/SSL.");

            System.out.println("Attempting to send synchronous test email to: " + to);
            mailSender.send(message);
            System.out.println("Synchronous test email sent successfully.");

            return ResponseEntity.ok("SUCCESS: Email sent to " + to);

        } catch (Exception e) {
            System.err.println("TEST EMAIL FAILED: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("FAILURE: " + e.getMessage());
        }
    }
    
    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("Pong! Backend is reachable.");
    }

    @GetMapping("/network")
    public ResponseEntity<String> testNetwork() {
        StringBuilder result = new StringBuilder();
        result.append("NETWORK DIAGNOSTIC REPORT:\n");

        // Test Port 587
        try (java.net.Socket socket = new java.net.Socket()) {
            result.append("Connecting to smtp.gmail.com:587... ");
            socket.connect(new java.net.InetSocketAddress("smtp.gmail.com", 587), 5000);
            result.append("SUCCESS. Connected.\n");
        } catch (Exception e) {
            result.append("FAILED. ").append(e.getClass().getSimpleName()).append(": ").append(e.getMessage()).append("\n");
        }

        // Test Port 465
        try (java.net.Socket socket = new java.net.Socket()) {
            result.append("Connecting to smtp.gmail.com:465... ");
            socket.connect(new java.net.InetSocketAddress("smtp.gmail.com", 465), 5000);
            result.append("SUCCESS. Connected.\n");
        } catch (Exception e) {
            result.append("FAILED. ").append(e.getClass().getSimpleName()).append(": ").append(e.getMessage()).append("\n");
        }

        return ResponseEntity.ok(result.toString());
    }
}
