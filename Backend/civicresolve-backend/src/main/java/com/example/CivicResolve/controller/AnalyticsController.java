package com.example.CivicResolve.controller;

import com.example.CivicResolve.dto.CategoryCount;
import com.example.CivicResolve.repository.IssueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private IssueRepository issueRepository;

    @GetMapping("/categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CategoryCount>> getIssuesByCategory() {
        return ResponseEntity.ok(issueRepository.countIssuesByCategory());
    }

    @GetMapping("/locations")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<com.example.CivicResolve.dto.LocationDTO>> getIssueLocations() {
        // Assuming we need a DTO for location
        return ResponseEntity.ok(issueRepository.findAll().stream()
                .map(issue -> new com.example.CivicResolve.dto.LocationDTO(issue.getLatitude(), issue.getLongitude(), 1.0)) // simple weight
                .collect(java.util.stream.Collectors.toList()));
    }
}
