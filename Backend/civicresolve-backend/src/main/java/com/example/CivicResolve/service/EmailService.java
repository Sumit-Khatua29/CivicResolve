package com.example.CivicResolve.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendIssueSolvedEmail(String toEmail, String issueDescription, Long issueId) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("civicresolve5@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Civic Issue Resolved - We Value Your Feedback");
        message.setText("Dear Citizen,\n\n" +
                "We are writing to inform you that the issue you reported regarding \"" + issueDescription + "\" has been successfully marked as resolved.\n\n" +
                "We value your engagement and would appreciate your feedback on the resolution process. Please take a moment to complete the feedback form available at the link below:\n" +
                "https://docs.google.com/forms/d/e/1FAIpQLSdkO1jzt7iyhC6qX23g3JKjla12DHIboMB8D5BOEW93EZZlzA/viewform?usp=sharing&ouid=105140467581029398903\n\n" +
                "Thank you for your continued support in improving our community.\n\n" +
                "Sincerely,\n" +
                "The Civic Resolve Team");

        System.out.println("Attempting to send email to: " + toEmail);
        mailSender.send(message);
        System.out.println("Email sent successfully to: " + toEmail);
    }

    @org.springframework.scheduling.annotation.Async
    public void sendWelcomeEmail(String toEmail, String username) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("civicresolve5@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Welcome to Civic Resolve!");
        message.setText("Dear " + username + ",\n\n" +
                "Welcome to Civic Resolve. We are delighted to have you as a member of our community.\n\n" +
                "Our platform is dedicated to streamlining civic engagement and issue resolution. We look forward to working together to improve our neighborhood.\n\n" +
                "Sincerely,\n" +
                "The Civic Resolve Team");

        System.out.println("Attempting to send welcome email to: " + toEmail);
        mailSender.send(message);
        System.out.println("Welcome email sent successfully to: " + toEmail);
    }
    public void sendIssueRejectedEmail(String toEmail, String issueDescription, Long issueId, String remark) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("civicresolve5@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Update on Your Reported Issue - Civic Resolve");
        message.setText("Dear Citizen,\n\n" +
                "We are writing to provide an update regarding the issue you reported: \"" + issueDescription + "\".\n\n" +
                "After a careful review, the administration team has rejected this report.\n" +
                "Reason: " + (remark != null && !remark.isEmpty() ? remark : "Administrator provided no specific reason.") + "\n\n" +
                "If you believe this decision is incorrect, please feel free to contact our support team or submit a new report with further details.\n\n" +
                "Sincerely,\n" +
                "The Civic Resolve Team");

        System.out.println("Attempting to send rejection email to: " + toEmail);
        mailSender.send(message);
        System.out.println("Rejection email sent successfully to: " + toEmail);
    }
}
