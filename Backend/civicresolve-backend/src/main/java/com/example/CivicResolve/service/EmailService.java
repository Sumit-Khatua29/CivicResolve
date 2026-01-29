package com.example.CivicResolve.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // Frontend URL (localhost fallback if env not set)
    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    /* ===================== WELCOME EMAIL ===================== */

    @Async
    public void sendWelcomeEmail(String toEmail, String username) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("civicresolve5@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Welcome to Civic Resolve!");
        message.setText(
                "Dear " + username + ",\n\n" +
                        "Welcome to Civic Resolve. We are delighted to have you as a member of our community.\n\n" +
                        "Sincerely,\n" +
                        "The Civic Resolve Team"
        );

        try {
            mailSender.send(message);
            System.out.println("Welcome email sent successfully to: " + toEmail);
        } catch (Exception e) {
            System.err.println("ERROR SENDING WELCOME EMAIL to " + toEmail + ": " + e.getMessage());
            e.printStackTrace();
        }
    }

    /* ===================== ISSUE REJECTED ===================== */

    @Async
    public void sendIssueRejectedEmail(String toEmail, String issueDescription, Long issueId, String remark) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("civicresolve5@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Update on Your Reported Issue - Civic Resolve");
        message.setText(
                "Dear Citizen,\n\n" +
                        "Your reported issue \"" + issueDescription + "\" has been rejected.\n\n" +
                        "Reason: " + (remark != null && !remark.isBlank() ? remark : "No specific reason provided.") + "\n\n" +
                        "Sincerely,\n" +
                        "The Civic Resolve Team"
        );

        try {
            mailSender.send(message);
            System.out.println("Issue Rejected email sent successfully to: " + toEmail);
        } catch (Exception e) {
            System.err.println("ERROR SENDING ISSUE REJECTED EMAIL to " + toEmail + ": " + e.getMessage());
            e.printStackTrace();
        }
    }

    /* ===================== CONTRACTOR APPROVED ===================== */

    @Async
    public void sendContractorApprovedEmail(String toEmail, String username) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("civicresolve5@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Contractor Account Approved - Civic Resolve");
        message.setText(
                "Dear " + username + ",\n\n" +
                        "Your contractor account has been approved.\n\n" +
                        "You may now log in and manage assigned issues.\n\n" +
                        "Sincerely,\n" +
                        "The Civic Resolve Team"
        );

        try {
            mailSender.send(message);
            System.out.println("Contractor Approved email sent successfully to: " + toEmail);
        } catch (Exception e) {
            System.err.println("ERROR SENDING CONTRACTOR APPROVED EMAIL to " + toEmail + ": " + e.getMessage());
            e.printStackTrace();
        }
    }

    /* ===================== CONTRACTOR REJECTED ===================== */

    @Async
    public void sendContractorRejectedEmail(String toEmail, String username) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("civicresolve5@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Contractor Application Update - Civic Resolve");
        message.setText(
                "Dear " + username + ",\n\n" +
                        "Your contractor application has been declined.\n\n" +
                        "You may re-apply in the future.\n\n" +
                        "Sincerely,\n" +
                        "The Civic Resolve Team"
        );

        try {
            mailSender.send(message);
            System.out.println("Contractor Rejected email sent successfully to: " + toEmail);
        } catch (Exception e) {
            System.err.println("ERROR SENDING CONTRACTOR REJECTED EMAIL to " + toEmail + ": " + e.getMessage());
            e.printStackTrace();
        }
    }

    /* ===================== ISSUE REASSIGNED ===================== */

    @Async
    public void sendIssueReassignedEmail(
            String toEmail,
            String contractorName,
            String issueDescription,
            Long issueId,
            String remark
    ) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("civicresolve5@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Issue Reassigned - Civic Resolve");
        message.setText(
                "Dear " + contractorName + ",\n\n" +
                        "The issue \"" + issueDescription + "\" (ID: " + issueId + ") requires improvement.\n\n" +
                        "Admin Remarks: " + (remark != null ? remark : "Please review the work.") + "\n\n" +
                        "Sincerely,\n" +
                        "The Civic Resolve Team"
        );

        try {
            mailSender.send(message);
            System.out.println("Issue Reassigned email sent successfully to: " + toEmail);
        } catch (Exception e) {
            System.err.println("ERROR SENDING ISSUE REASSIGNED EMAIL to " + toEmail + ": " + e.getMessage());
            e.printStackTrace();
        }
    }

    /* ===================== ISSUE REPORTED (WITH IMAGE) ===================== */

    @Async
    public void sendIssueReportedEmail(
            String toEmail,
            String username,
            String issueDescription,
            Long issueId,
            byte[] imageData,
            String imageName
    ) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom("civicresolve5@gmail.com");
            helper.setTo(toEmail);
            helper.setSubject("Issue Reported Successfully - Civic Resolve");
            helper.setText(
                    "Dear " + username + ",\n\n" +
                            "Your issue has been reported successfully.\n\n" +
                            "Issue ID: " + issueId + "\n\n" +
                            "Sincerely,\n" +
                            "The Civic Resolve Team"
            );

            if (imageData != null && imageData.length > 0) {
                helper.addAttachment(
                        imageName != null ? imageName : "issue_image.jpg",
                        new ByteArrayResource(imageData)
                );
            }

            mailSender.send(message);
        } catch (MessagingException e) {
            System.err.println("ERROR SENDING ISSUE REPORT EMAIL to " + toEmail + ": " + e.getMessage());
            e.printStackTrace();
        }
    }

    /* ===================== ISSUE RESOLVED (WITH BEFORE & AFTER IMAGES) ===================== */

    @Async
    public void sendIssueResolvedWithImageEmail(
            String toEmail,
            String issueDescription,
            Long issueId,
            byte[] beforeImageData,
            String beforeImageName,
            byte[] afterImageData,
            String afterImageName
    ) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom("civicresolve5@gmail.com");
            helper.setTo(toEmail);
            helper.setSubject("Issue Resolved - Civic Resolve");
            helper.setText(
                    "Dear Citizen,\n\n" +
                            "Your issue \"" + issueDescription + "\" (ID: " + issueId + ") has been resolved.\n\n" +
                            "Give feedback here:\n" +
                            frontendUrl + "/feedback/" + issueId + "\n\n" +
                            "Sincerely,\n" +
                            "The Civic Resolve Team"
            );

            if (beforeImageData != null) {
                helper.addAttachment(
                        beforeImageName != null ? "Before_" + beforeImageName : "before.jpg",
                        new ByteArrayResource(beforeImageData)
                );
            }

            if (afterImageData != null) {
                helper.addAttachment(
                        afterImageName != null ? "After_" + afterImageName : "after.jpg",
                        new ByteArrayResource(afterImageData)
                );
            }

            mailSender.send(message);
        } catch (MessagingException e) {
            System.err.println("ERROR SENDING ISSUE RESOLVED EMAIL to " + toEmail + ": " + e.getMessage());
            e.printStackTrace();
        }
    }

    /* ===================== PASSWORD RESET ===================== */

    @Async
    public void sendPasswordResetEmail(String toEmail, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("civicresolve5@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Password Reset Request - Civic Resolve");
        message.setText(
                "Dear User,\n\n" +
                        "Reset your password using the link below:\n" +
                        frontendUrl + "/reset-password?token=" + token + "\n\n" +
                        "This link expires in 15 minutes.\n\n" +
                        "Sincerely,\n" +
                        "The Civic Resolve Team"
        );

        try {
            mailSender.send(message);
            System.out.println("Password reset email sent successfully to: " + toEmail);
        } catch (Exception e) {
            System.err.println("ERROR SENDING PASSWORD RESET EMAIL to " + toEmail + ": " + e.getMessage());
            e.printStackTrace();
        }
    }
}
