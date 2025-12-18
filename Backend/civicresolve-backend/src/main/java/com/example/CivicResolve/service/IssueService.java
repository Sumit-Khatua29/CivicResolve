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
    private FileService fileService;

    @Autowired
    private NotificationService notificationService;

    public void deleteIssue(Integer id, String username){
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not Found"));

        if (!issue.getUser().getUsername().equals(username) &&
            !userRepository.findByUsername(username).get().getRole().name().equals("ROLE_ADMIN")){
            throw new RuntimeException("You are not authorized to delete this issue");
        }

        issueRepository.delete(issue);
    }

    public IssueResponse createIssue(String description, String address, Category category, String otherCategory, Double latitude, Double longitude, MultipartFile image, String username) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String fileName = fileService.storeFile(image);

        // Generate file download URI
        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/issues/image/")
                .path(fileName)
                .toUriString();

        Issue issue = new Issue();
        issue.setDescription(description);
        issue.setAddress(address);
        issue.setCategory(category);
        if(category == Category.OTHER) {
            issue.setOtherCategory(otherCategory);
        }
        issue.setLatitude(latitude);
        issue.setLongitude(longitude);
        issue.setImagePath(fileDownloadUri);
        issue.setUser(user);

        Issue savedIssue = issueRepository.save(issue);

        return mapToResponse(savedIssue);
    }

    public IssueResponse updateIssue(Integer id, String description, String address, Category category, Double latitude, Double longitude, MultipartFile image, String username) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        if (!issue.getUser().getUsername().equals(username) &&
                !userRepository.findByUsername(username).get().getRole().name().equals("ROLE_ADMIN")) {
            throw new RuntimeException("You are not authorized to update this issue");
        }

        issue.setDescription(description);
        issue.setAddress(address);
        issue.setCategory(category);
        issue.setLatitude(latitude);
        issue.setLongitude(longitude);

        if (image != null && !image.isEmpty()) {
            String fileName = fileService.storeFile(image);
            String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/api/issues/image/")
                    .path(fileName)
                    .toUriString();
            issue.setImagePath(fileDownloadUri);
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

    public IssueResponse getIssueById(Integer id) {
        Issue issue = issueRepository.findById(id).orElseThrow(() -> new RuntimeException("Issue not found"));
        return mapToResponse(issue);
    }

    public IssueResponse updateIssueStatus(Integer id, IssueStatus status) {
        Issue issue = issueRepository.findById(id).orElseThrow(() -> new RuntimeException("Issue not found"));
        issue.setStatus(status);
        Issue savedIssue = issueRepository.save(issue);

        // Send notification
        notificationService.sendStatusUpdateEmail(savedIssue.getUser().getEmail(), savedIssue.getId(), status.name());

        return mapToResponse(savedIssue);
    }

    private IssueResponse mapToResponse(Issue issue) {
        IssueResponse response = new IssueResponse();
        response.setId(issue.getId());
        response.setDescription(issue.getDescription());
        response.setAddress(issue.getAddress());
        response.setCategory(issue.getCategory());
        response.setOtherCategory(issue.getOtherCategory());
        response.setLatitude(issue.getLatitude());
        response.setLongitude(issue.getLongitude());
        response.setImagePath(issue.getImagePath());
        response.setStatus(issue.getStatus());
        response.setCreatedAt(issue.getCreatedAt());
        response.setReportedBy(issue.getUser().getUsername());
        return response;
    }
}
