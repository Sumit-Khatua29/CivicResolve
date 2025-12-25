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
                "We are pleased to inform you that your reported issue regarding: \"" + issueDescription + "\" has been marked as SOLVED.\n\n" +
                "We would appreciate your feedback on the resolution process. Please click the link below to provide feedback:\n" +
                "https://docs.google.com/forms/d/e/1FAIpQLSdkO1jzt7iyhC6qX23g3JKjla12DHIboMB8D5BOEW93EZZlzA/viewform?usp=sharing&ouid=105140467581029398903\n\n" +
                "Thank you for your contribution to improving our community.\n\n" +
                "Best Regards,\n" +
                "Civic Resolve Team");



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
                "Welcome to Civic Resolve! We are excited to have you on board.\n" +
                "Together, we can make our community better.\n\n" +
                "Best Regards,\n" +
                "Civic Resolve Team");

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
                "Regarding your reported issue: \"" + issueDescription + "\"\n\n" +
                "After review, the admin has marked this issue as REJECTED.\n" +
                "Reason/Remark: " + (remark != null && !remark.isEmpty() ? remark : "None provided") + "\n\n" +
                "If you believe this is a mistake, please contact support or file a new report with more details.\n\n" +
                "Best Regards,\n" +
                "Civic Resolve Team");

        System.out.println("Attempting to send rejection email to: " + toEmail);
        mailSender.send(message);
        System.out.println("Rejection email sent successfully to: " + toEmail);
    }
}
