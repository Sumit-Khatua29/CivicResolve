package com.example.CivicResolve.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @org.springframework.scheduling.annotation.Async
    public void sendWelcomeEmail(String toEmail, String username) {
        System.out.println("EmailService: sendWelcomeEmail running in thread: "
                + Thread.currentThread().getName());
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("civicresolve5@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Welcome to Civic Resolve!");
        message.setText("Dear " + username + ",\n\n" +
                "Welcome to Civic Resolve. We are delighted to have you as a member of our community.\n\n"
                +
                "Our platform is dedicated to streamlining civic engagement and issue resolution. We look forward to working together to improve our neighborhood.\n\n"
                +
                "Sincerely,\n" +
                "The Civic Resolve Team");

        System.out.println("Attempting to send welcome email to: " + toEmail);
        mailSender.send(message);
        System.out.println("Welcome email sent successfully to: " + toEmail);
    }

    @org.springframework.scheduling.annotation.Async
    public void sendIssueRejectedEmail(String toEmail, String issueDescription, Long issueId, String remark) {
        System.out
                .println("EmailService: sendIssueRejectedEmail running in thread: "
                        + Thread.currentThread().getName());
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("civicresolve5@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Update on Your Reported Issue - Civic Resolve");
        message.setText("Dear Citizen,\n\n" +
                "We are writing to provide an update regarding the issue you reported: \""
                + issueDescription
                + "\".\n\n" +
                "After a careful review, the administration team has rejected this report.\n" +
                "Reason: "
                + (remark != null && !remark.isEmpty() ? remark
                : "Administrator provided no specific reason.")
                + "\n\n"
                +
                "If you believe this decision is incorrect, please feel free to contact our support team or submit a new report with further details.\n\n"
                +
                "Sincerely,\n" +
                "The Civic Resolve Team");

        System.out.println("Attempting to send rejection email to: " + toEmail);
        mailSender.send(message);
        System.out.println("Rejection email sent successfully to: " + toEmail);
    }

    @org.springframework.scheduling.annotation.Async
    public void sendContractorApprovedEmail(String toEmail, String username) {
        System.out.println(
                "EmailService: sendContractorApprovedEmail running in thread: "
                        + Thread.currentThread().getName());
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("civicresolve5@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Contractor Account Approved - Civic Resolve");
        message.setText("Dear " + username + ",\n\n" +
                "Congratulations! Your contractor account has been approved by the administration.\n\n"
                +
                "You can now log in to the Civic Resolve platform and start managing assigned issues.\n\n"
                +
                "Thank you for joining our network.\n\n" +
                "Sincerely,\n" +
                "The Civic Resolve Team");

        System.out.println("Attempting to send contractor approval email to: " + toEmail);
        mailSender.send(message);
        System.out.println("Contractor approval email sent successfully to: " + toEmail);
    }

    @org.springframework.scheduling.annotation.Async
    public void sendContractorRejectedEmail(String toEmail, String username) {
        System.out.println(
                "EmailService: sendContractorRejectedEmail running in thread: "
                        + Thread.currentThread().getName());
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("civicresolve5@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Contractor Application Update - Civic Resolve");
        message.setText("Dear " + username + ",\n\n" +
                "We regret to inform you that your application to join Civic Resolve as a contractor has been declined at this time.\n\n"
                +
                "This decision may be due to incomplete information or current capacity limits.\n\n"
                +
                "You are welcome to re-apply in the future.\n\n" +
                "Sincerely,\n" +
                "The Civic Resolve Team");

        System.out.println("Attempting to send contractor rejection email to: " + toEmail);
        mailSender.send(message);
        System.out.println("Contractor rejection email sent successfully to: " + toEmail);
    }

    @org.springframework.scheduling.annotation.Async
    public void sendIssueReassignedEmail(String toEmail, String contractorName, String issueDescription, Long issueId, String remark) {
        System.out.println("EmailService: sendIssueReassignedEmail running in thread: " + Thread.currentThread().getName());
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("civicresolve5@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Work Reassigned - Improvement Required - Civic Resolve");
        message.setText("Dear " + contractorName + ",\n\n" +
                "The administration has reviewed the work for Issue ID: " + issueId + " (\"" + issueDescription + "\") and has requested further improvements.\n\n" +
                "Admin Remarks: " + (remark != null ? remark : "Please review the work.") + "\n\n" +
                "The issue status has been set back to IN_PROGRESS. Please address the feedback and resubmit.\n\n" +
                "Sincerely,\n" +
                "The Civic Resolve Team");

        System.out.println("Attempting to send reassignment email to: " + toEmail);
        mailSender.send(message);
        System.out.println("Reassignment email sent successfully to: " + toEmail);
    }

    @org.springframework.scheduling.annotation.Async
    public void sendIssueReportedEmail(String toEmail, String username, String issueDescription, Long issueId,
                                       byte[] imageData, String imageName) {
        System.out.println("EmailService: sendIssueReportedEmail running in thread: "
                + Thread.currentThread().getName());
        try {
            jakarta.mail.internet.MimeMessage message = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(
                    message, true);

            helper.setFrom("civicresolve5@gmail.com");
            helper.setTo(toEmail);
            helper.setSubject("Issue Reported Successfully - Civic Resolve");
            helper.setText("Dear " + username + ",\n\n" +
                    "Thank you for reporting an issue (" + issueDescription + ").\n" +
                    "Your Issue ID is: " + issueId + "\n\n" +
                    "We have received your report and it has been queued for review by our administration team.\n"
                    +
                    "You will receive further updates as the status of your reported issue changes.\n\n"
                    +
                    "Thank you for being a responsible citizen.\n\n" +
                    "Sincerely,\n" +
                    "The Civic Resolve Team");

            if (imageData != null && imageData.length > 0) {
                helper.addAttachment(imageName != null ? imageName : "issue_image.jpg",
                        new org.springframework.core.io.ByteArrayResource(imageData));
            }

            mailSender.send(message);
            System.out.println("Issue reported email sent successfully to: " + toEmail);

        } catch (jakarta.mail.MessagingException e) {
            System.err.println("Error sending issue reported email: " + e.getMessage());
        }
    }

    @org.springframework.scheduling.annotation.Async
    public void sendIssueResolvedWithImageEmail(String toEmail, String issueDescription, Long issueId,
                                                byte[] beforeImageData, String beforeImageName,
                                                byte[] afterImageData, String afterImageName) {
        System.out.println("EmailService: sendIssueResolvedWithImageEmail running in thread: "
                + Thread.currentThread().getName());
        try {
            jakarta.mail.internet.MimeMessage message = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(
                    message, true);

            helper.setFrom("civicresolve5@gmail.com");
            helper.setTo(toEmail);
            helper.setSubject("Civic Issue Resolved - Evidence Attached");
            helper.setText("Dear Citizen,\n\n" +
                    "We are pleased to inform you that the issue regarding \"" + issueDescription
                    + "\" (ID: " + issueId + ") has been resolved.\n\n" +
                    "Please find the attached images as evidence of the resolution (Before and After work).\n\n" +
                    "We value your feedback. Please let us know if you are satisfied with the work by filling out the feedback form here:\n" +
                    "http://localhost:5173/feedback/" + issueId + "\n\n" +
                    "Sincerely,\n" +
                    "The Civic Resolve Team");

            if (beforeImageData != null && beforeImageData.length > 0) {
                helper.addAttachment(beforeImageName != null ? "Before_" + beforeImageName : "before_work.jpg",
                        new org.springframework.core.io.ByteArrayResource(beforeImageData));
            }

            if (afterImageData != null && afterImageData.length > 0) {
                helper.addAttachment(afterImageName != null ? "After_" + afterImageName : "after_work.jpg",
                        new org.springframework.core.io.ByteArrayResource(afterImageData));
            }

            mailSender.send(message);
            System.out.println("Resolved email with attachments sent to: " + toEmail);

        } catch (jakarta.mail.MessagingException e) {
            System.err.println("Error sending resolved email with attachment: " + e.getMessage());
        }
    }
}
