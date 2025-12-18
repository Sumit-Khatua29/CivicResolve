package com.example.CivicResolve.controller;

import com.example.CivicResolve.Model.Category;
import com.example.CivicResolve.Model.IssueStatus;
import com.example.CivicResolve.dto.IssueResponse;
import com.example.CivicResolve.dto.MessageResponse;
import com.example.CivicResolve.security.UserDetailsImpl;
import com.example.CivicResolve.service.FileService;
import com.example.CivicResolve.service.IssueService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/issues")
public class IssueController {

    @Autowired
    private IssueService issueService;

    @Autowired
    private FileService fileService;

    @PostMapping
    @PreAuthorize("hasRole('CITIZEN') or hasRole('ADMIN')")
    public ResponseEntity<IssueResponse> createIssue(
            @RequestParam("description") String description,
            @RequestParam("address") String address,
            @RequestParam("category") Category category,
            @RequestParam(value = "otherCategory", required = false) String otherCategory,
            @RequestParam("latitude") Double latitude,
            @RequestParam("longitude") Double longitude,
            @RequestParam("image") MultipartFile image,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        IssueResponse issue = issueService.createIssue(description, address, category, otherCategory, latitude, longitude, image, userDetails.getUsername());
        return ResponseEntity.ok(issue);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CITIZEN') or hasRole('ADMIN')")
    public ResponseEntity<IssueResponse> updateIssue(
            @PathVariable Integer id,
            @RequestParam("description") String description,
            @RequestParam("address") String address,
            @RequestParam("category") Category category,
            @RequestParam("latitude") Double latitude,
            @RequestParam("longitude") Double longitude,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        IssueResponse issue = issueService.updateIssue(id, description, address, category, latitude, longitude, image, userDetails.getUsername());
        return ResponseEntity.ok(issue);
    }

    @GetMapping
    public ResponseEntity<List<IssueResponse>> getAllIssues() {
        return ResponseEntity.ok(issueService.getAllIssues());
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CITIZEN') or hasRole('ADMIN')")
    public ResponseEntity<List<IssueResponse>> getMyIssues(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(issueService.getUserIssues(userDetails.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<IssueResponse> getIssueById(@PathVariable Integer id) {
        return ResponseEntity.ok(issueService.getIssueById(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CITIZEN') or hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deleteIssue(@PathVariable Integer id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        issueService.deleteIssue(id, userDetails.getUsername());
        return ResponseEntity.ok(new MessageResponse("Issue deleted successfully!"));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<IssueResponse> updateStatus(@PathVariable Integer id, @RequestParam IssueStatus status) {
        return ResponseEntity.ok(issueService.updateIssueStatus(id, status));
    }

    @GetMapping("/image/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, HttpServletRequest request) {
        Resource resource = fileService.loadFileAsResource(fileName);

        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            // logger.info("Could not determine file type.");
        }

        if(contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}

