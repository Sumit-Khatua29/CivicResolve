package com.example.CivicResolve.controller;

import com.example.CivicResolve.Model.Users;
import com.example.CivicResolve.dto.UserProfileResponse;
import com.example.CivicResolve.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.example.CivicResolve.repository.ContractorRepository contractorRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Users>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserProfileResponse> getProfile(java.security.Principal principal) {
        Users user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(new UserProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getPhoneNumber(),
                user.getAddress(),
                user.getRole().name()));
    }

    @PutMapping("/{id}/block")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Users> blockUser(@PathVariable Integer id) {
        Users user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getRole() == com.example.CivicResolve.Model.Role.ROLE_ADMIN) {
            throw new RuntimeException("Cannot block an Admin user.");
        }
        user.setEnabled(false);
        return ResponseEntity.ok(userRepository.save(user));
    }

    @PutMapping("/{id}/enable")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Users> enableUser(@PathVariable Integer id) {
        Users user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(true);
        return ResponseEntity.ok(userRepository.save(user));
    }

    @PostMapping("/{id}/upgrade-contractor")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> upgradeToContractor(@PathVariable Integer id,
                                                      @RequestParam String assignedArea,
                                                      @RequestParam(required = false) String specialization) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(com.example.CivicResolve.Model.Role.ROLE_CONTRACTOR);
        userRepository.save(user);

        com.example.CivicResolve.Model.Contractor contractor = new com.example.CivicResolve.Model.Contractor();
        contractor.setUser(user);
        contractor.setAssignedArea(assignedArea);
        contractor.setSpecialization(specialization);
        contractorRepository.save(contractor);

        return ResponseEntity.ok("User upgraded to Contractor successfully!");
    }

    @Autowired
    private com.example.CivicResolve.repository.IssueRepository issueRepository;

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable Integer id) {
        Users user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == com.example.CivicResolve.Model.Role.ROLE_ADMIN) {
            throw new RuntimeException("Cannot delete an Admin user.");
        }

        if (user.getRole() == com.example.CivicResolve.Model.Role.ROLE_CONTRACTOR) {
            java.util.Optional<com.example.CivicResolve.Model.Contractor> contractorOpt = contractorRepository
                    .findByUser(user);
            if (contractorOpt.isPresent()) {
                com.example.CivicResolve.Model.Contractor contractor = contractorOpt.get();
                java.util.List<com.example.CivicResolve.Model.Issue> assignedIssues = issueRepository
                        .findByContractor(contractor);

                for (com.example.CivicResolve.Model.Issue issue : assignedIssues) {
                    issue.setContractor(null);
                    if (issue.getStatus() == com.example.CivicResolve.Model.IssueStatus.IN_PROGRESS) {
                        issue.setStatus(com.example.CivicResolve.Model.IssueStatus.VERIFIED); // Return to pool for
                        // assignment
                    }
                    issueRepository.save(issue);
                }
                contractorRepository.delete(contractor);
            }
        }

        userRepository.delete(user);
        return ResponseEntity.ok("User deleted successfully.");
    }

}
