package com.example.CivicResolve.controller;

import com.example.CivicResolve.Model.Category;
import com.example.CivicResolve.Model.IssueStatus;
import com.example.CivicResolve.dto.IssueResponse;
import com.example.CivicResolve.dto.MessageResponse;
import com.example.CivicResolve.security.UserDetailsImpl;
import com.example.CivicResolve.service.IssueService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/issues")
public class IssueController {

    @Autowired
    private IssueService issueService;

    @PostMapping
    @PreAuthorize("hasRole('CITIZEN') or hasRole('ADMIN') or hasRole('CONTRACTOR')")
    public ResponseEntity<IssueResponse> createIssue(
            @RequestParam("description") String description,
            @RequestParam("address") String address,
            @RequestParam("pincode") String pincode,
            @RequestParam("category") Category category,
            @RequestParam(value = "otherCategory", required = false) String otherCategory,
            @RequestParam("latitude") Double latitude,
            @RequestParam("longitude") Double longitude,
            @RequestParam("image") MultipartFile image,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        IssueResponse issue = issueService.createIssue(description, address, pincode, category, otherCategory, latitude,
                longitude, image, userDetails.getUsername());
        return ResponseEntity.ok(issue);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CITIZEN') or hasRole('ADMIN') or hasRole('CONTRACTOR')")
    public ResponseEntity<IssueResponse> updateIssue(
            @PathVariable Long id,
            @RequestParam("description") String description,
            @RequestParam("address") String address,
            @RequestParam("pincode") String pincode,
            @RequestParam("category") Category category,
            @RequestParam("latitude") Double latitude,
            @RequestParam("longitude") Double longitude,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        IssueResponse issue = issueService.updateIssue(id, description, address, pincode, category, latitude, longitude,
                image,
                userDetails.getUsername());
        return ResponseEntity.ok(issue);
    }

    @GetMapping
    public ResponseEntity<List<IssueResponse>> getAllIssues() {
        return ResponseEntity.ok(issueService.getAllIssues());
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CITIZEN') or hasRole('ADMIN') or hasRole('CONTRACTOR')")
    public ResponseEntity<List<IssueResponse>> getMyIssues(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(issueService.getUserIssues(userDetails.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<IssueResponse> getIssueById(@PathVariable Long id) {
        return ResponseEntity.ok(issueService.getIssueById(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CITIZEN') or hasRole('ADMIN') or hasRole('CONTRACTOR')")
    public ResponseEntity<MessageResponse> deleteIssue(@PathVariable Long id,
                                                       @AuthenticationPrincipal UserDetailsImpl userDetails) {
        issueService.deleteIssue(id, userDetails.getUsername());
        return ResponseEntity.ok(new MessageResponse("Issue deleted successfully!"));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('CONTRACTOR')")
    public ResponseEntity<IssueResponse> updateStatus(@PathVariable Long id,
                                                      @RequestParam IssueStatus status,
                                                      @RequestParam(required = false) String remark,
                                                      @RequestParam(required = false) MultipartFile beforeImage,
                                                      @RequestParam(required = false) MultipartFile afterImage) {
        System.out.println("Update Status Request - ID: " + id + ", Status: " + status + ", Remark: " + remark);
        try {
            return ResponseEntity.ok(issueService.updateIssueStatus(id, status, remark, beforeImage, afterImage));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}/image/before")
    public ResponseEntity<byte[]> getBeforeIssueImage(@PathVariable Long id) {
        return issueService.getBeforeIssueImage(id);
    }

    @GetMapping("/{id}/image/after")
    public ResponseEntity<byte[]> getAfterIssueImage(@PathVariable Long id) {
        return issueService.getAfterIssueImage(id);
    }

    @PutMapping("/{id}/assign/{contractorId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> assignIssue(@PathVariable Long id, @PathVariable Long contractorId) {
        issueService.assignIssueToContractor(id, contractorId);
        return ResponseEntity.ok(new MessageResponse("Issue assigned to contractor successfully!"));
    }

    @GetMapping("/contractor")
    @PreAuthorize("hasRole('CONTRACTOR')")
    public ResponseEntity<List<IssueResponse>> getContractorIssues(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(issueService.getContractorIssues(userDetails.getUsername()));
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getIssueImage(@PathVariable Long id) {
        return issueService.getIssueImage(id);
    }
}
