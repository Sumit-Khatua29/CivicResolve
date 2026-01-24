package com.example.CivicResolve.service;

import com.example.CivicResolve.Model.Category;
import com.example.CivicResolve.Model.Issue;
import com.example.CivicResolve.Model.IssueStatus;
import com.example.CivicResolve.Model.Users;
import com.example.CivicResolve.dto.IssueResponse;
import com.example.CivicResolve.repository.IssueRepository;
import com.example.CivicResolve.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class IssueService {

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.example.CivicResolve.repository.ContractorRepository contractorRepository;

    @Autowired
    private EmailService emailService;

    public void deleteIssue(Long id, String username) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        if (!issue.getUser().getUsername().equals(username) &&
                !userRepository.findByUsername(username).get().getRole().name().equals("ROLE_ADMIN")) {
            throw new RuntimeException("You are not authorized to delete this issue");
        }

        // Citizens cannot delete issues that are being processed
        if (!userRepository.findByUsername(username).get().getRole().name().equals("ROLE_ADMIN")) {
            if (issue.getStatus() == IssueStatus.VERIFIED || issue.getStatus() == IssueStatus.IN_PROGRESS) {
                throw new RuntimeException("Cannot delete issue while it is under review or in progress.");
            }
        }

        issueRepository.delete(issue);
    }

    public IssueResponse createIssue(String description, String address, String pincode, Category category,
                                     String otherCategory,
                                     Double latitude, Double longitude, MultipartFile image, String username) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Issue issue = new Issue();
        issue.setDescription(description);
        issue.setAddress(address);
        issue.setPincode(pincode);

        if (image != null && !image.isEmpty()) {
            try {
                issue.setImageData(image.getBytes());
                issue.setImageType(image.getContentType());
                issue.setImageName(image.getOriginalFilename());
            } catch (Exception e) {
                throw new RuntimeException("Could not store image data", e);
            }
        }

        issue.setCategory(category);
        if (category == Category.OTHER) {
            issue.setOtherCategory(otherCategory);
        }
        issue.setLatitude(latitude);
        issue.setLongitude(longitude);
        issue.setUser(user);

        Issue savedIssue = issueRepository.save(issue);

        // Send confirmation email asynchronously
        try {
            emailService.sendIssueReportedEmail(user.getEmail(), user.getUsername(), issue.getDescription(),
                    savedIssue.getId(), issue.getImageData(), issue.getImageName());
        } catch (Exception e) {
            System.err.println("Failed to send issue reporting email: " + e.getMessage());
        }

        return mapToResponse(savedIssue);
    }

    public IssueResponse updateIssue(Long id, String description, String address, String pincode, Category category,
                                     Double latitude,
                                     Double longitude, MultipartFile image, String username) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        if (!issue.getUser().getUsername().equals(username) &&
                !userRepository.findByUsername(username).get().getRole().name().equals("ROLE_ADMIN")) {
            throw new RuntimeException("You are not authorized to update this issue");
        }

        if (issue.getStatus() != IssueStatus.PENDING) {
            throw new RuntimeException("Issues can only be edited before they are verified.");
        }

        issue.setDescription(description);
        issue.setAddress(address);
        issue.setPincode(pincode);
        issue.setCategory(category);
        issue.setLatitude(latitude);
        issue.setLongitude(longitude);

        if (image != null && !image.isEmpty()) {
            try {
                issue.setImageData(image.getBytes());
                issue.setImageType(image.getContentType());
                issue.setImageName(image.getOriginalFilename());
            } catch (Exception e) {
                throw new RuntimeException("Could not store image data", e);
            }
        }

        Issue updatedIssue = issueRepository.save(issue);
        return mapToResponse(updatedIssue);
    }

    public List<IssueResponse> getAllIssues() {
        return issueRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<IssueResponse> getUserIssues(String username) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return issueRepository.findByUser(user).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public IssueResponse getIssueById(Long id) {
        Issue issue = issueRepository.findById(id).orElseThrow(() -> new RuntimeException("Issue not found"));
        return mapToResponse(issue);
    }

    public IssueResponse updateIssueStatus(Long id, IssueStatus status, String remark,
                                           MultipartFile beforeImage, MultipartFile afterImage) {
        Issue issue = issueRepository.findById(id).orElseThrow(() -> new RuntimeException("Issue not found"));
        issue.setStatus(status);
        if (remark != null) {
            issue.setRemark(remark);
        }

        if (beforeImage != null && !beforeImage.isEmpty()) {
            try {
                issue.setBeforeImageData(beforeImage.getBytes());
                issue.setBeforeImageType(beforeImage.getContentType());
                issue.setBeforeImageName(beforeImage.getOriginalFilename());
            } catch (Exception e) {
                throw new RuntimeException("Could not store before image data", e);
            }
        }

        if (afterImage != null && !afterImage.isEmpty()) {
            try {
                issue.setAfterImageData(afterImage.getBytes());
                issue.setAfterImageType(afterImage.getContentType());
                issue.setAfterImageName(afterImage.getOriginalFilename());
            } catch (Exception e) {
                throw new RuntimeException("Could not store after image data", e);
            }
        }

        Issue savedIssue = issueRepository.save(issue);

        System.out.println("Updating status to: " + status);
        if (status == IssueStatus.RESOLVED) {
            String userEmail = issue.getUser().getEmail();
            String description = issue.getDescription();
            // Send email to Citizen
            try {
                emailService.sendIssueResolvedWithImageEmail(userEmail, description, issue.getId(),
                        issue.getBeforeImageData(), issue.getBeforeImageName(),
                        issue.getAfterImageData(), issue.getAfterImageName());
            } catch (Exception e) {
                System.err.println("Failed to send email: " + e.getMessage());
            }
        } else if (status == IssueStatus.REJECTED) {
            // Rejection of the initial issue report
            String userEmail = issue.getUser().getEmail();
            String description = issue.getDescription();
            try {
                emailService.sendIssueRejectedEmail(userEmail, description, issue.getId(), remark);
            } catch (Exception e) {
                System.err.println("Failed to send rejection email: " + e.getMessage());
            }
        } else if (status == IssueStatus.IN_PROGRESS && remark != null && issue.getContractor() != null) {
            // Reassignment / Improvement Request to Contractor (if remark is present)
            try {
                // Fetch contractor user to get email
                com.example.CivicResolve.Model.Users contractorUser = issue.getContractor().getUser();
                emailService.sendIssueReassignedEmail(contractorUser.getEmail(), contractorUser.getUsername(), issue.getDescription(), issue.getId(), remark);
            } catch (Exception e) {
                System.err.println("Failed to send reassignment email: " + e.getMessage());
            }
        }

        return mapToResponse(savedIssue);
    }

    public void assignIssueToContractor(Long issueId, Long contractorId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found"));
        com.example.CivicResolve.Model.Contractor contractor = contractorRepository.findById(contractorId)
                .orElseThrow(() -> new RuntimeException("Contractor not found"));

        issue.setContractor(contractor);
        issue.setStatus(IssueStatus.IN_PROGRESS); // Or VERIFIED depending on flow
        issueRepository.save(issue);
    }

    public List<IssueResponse> getContractorIssues(String username) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        com.example.CivicResolve.Model.Contractor contractor = contractorRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Contractor profile not found"));

        return issueRepository.findByContractor(contractor).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public org.springframework.http.ResponseEntity<byte[]> getIssueImage(Long id) {
        Issue issue = issueRepository.findById(id).orElseThrow(() -> new RuntimeException("Issue not found"));

        if (issue.getImageData() == null) {
            throw new RuntimeException("Image not found for this issue");
        }

        return org.springframework.http.ResponseEntity.ok()
                .contentType(org.springframework.http.MediaType.parseMediaType(issue.getImageType()))
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + issue.getImageName() + "\"")
                .body(issue.getImageData());
    }

    public org.springframework.http.ResponseEntity<byte[]> getBeforeIssueImage(Long id) {
        Issue issue = issueRepository.findById(id).orElseThrow(() -> new RuntimeException("Issue not found"));

        if (issue.getBeforeImageData() == null) {
            throw new RuntimeException("Before Image not found for this issue");
        }

        return org.springframework.http.ResponseEntity.ok()
                .contentType(org.springframework.http.MediaType.parseMediaType(issue.getBeforeImageType()))
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + issue.getBeforeImageName() + "\"")
                .body(issue.getBeforeImageData());
    }

    public org.springframework.http.ResponseEntity<byte[]> getAfterIssueImage(Long id) {
        Issue issue = issueRepository.findById(id).orElseThrow(() -> new RuntimeException("Issue not found"));

        if (issue.getAfterImageData() == null) {
            throw new RuntimeException("After Image not found for this issue");
        }

        return org.springframework.http.ResponseEntity.ok()
                .contentType(org.springframework.http.MediaType.parseMediaType(issue.getAfterImageType()))
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + issue.getAfterImageName() + "\"")
                .body(issue.getAfterImageData());
    }

    private IssueResponse mapToResponse(Issue issue) {
        IssueResponse response = new IssueResponse();
        response.setId(issue.getId());
        response.setDescription(issue.getDescription());
        response.setAddress(issue.getAddress());
        response.setPincode(issue.getPincode());
        response.setCategory(issue.getCategory());
        response.setOtherCategory(issue.getOtherCategory());
        response.setLatitude(issue.getLatitude());
        response.setLongitude(issue.getLongitude());
        if (issue.getImageData() != null) {
            String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/api/issues/")
                    .path(String.valueOf(issue.getId()))
                    .path("/image")
                    .toUriString();
            response.setImagePath(fileDownloadUri);
        } else {
            response.setImagePath(null);
        }
        if (issue.getBeforeImageData() != null) {
            String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/api/issues/")
                    .path(String.valueOf(issue.getId()))
                    .path("/image/before")
                    .toUriString();
            response.setBeforeImagePath(fileDownloadUri);
        } else {
            response.setBeforeImagePath(null);
        }

        if (issue.getAfterImageData() != null) {
            String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/api/issues/")
                    .path(String.valueOf(issue.getId()))
                    .path("/image/after")
                    .toUriString();
            response.setAfterImagePath(fileDownloadUri);
        } else {
            response.setAfterImagePath(null);
        }

        response.setStatus(issue.getStatus());
        response.setCreatedAt(issue.getCreatedAt());
        response.setReportedBy(issue.getUser().getUsername());
        response.setRemark(issue.getRemark());
        response.setUpdatedAt(issue.getUpdatedAt());
        if (issue.getContractor() != null) {
            // We might want to add contractor info to response, checking DTO first
        }
        return response;
    }
}
