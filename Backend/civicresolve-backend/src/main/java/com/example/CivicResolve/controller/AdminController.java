package com.example.CivicResolve.controller;

import com.example.CivicResolve.Model.Contractor;
import com.example.CivicResolve.Model.Users;
import com.example.CivicResolve.dto.MessageResponse;
import com.example.CivicResolve.repository.ContractorRepository;
import com.example.CivicResolve.repository.UserRepository;
import com.example.CivicResolve.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    ContractorRepository contractorRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    EmailService emailService;

    @GetMapping("/contractors/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Contractor> getPendingContractors() {
        return contractorRepository.findAllPendingContractors();
    }

    @GetMapping("/contractors")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Contractor> getApprovedContractors() {
        return contractorRepository.findAllApprovedContractors();
    }

    @PutMapping("/contractors/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approveContractor(@PathVariable Long id) {
        Contractor contractor = contractorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Contractor not found."));

        Users user = contractor.getUser();
        user.setEnabled(true);
        userRepository.save(user);

        // Send approval email
        emailService.sendContractorApprovedEmail(user.getEmail(), user.getUsername());

        return ResponseEntity.ok(new MessageResponse("Contractor approved successfully!"));
    }

    @DeleteMapping("/contractors/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteContractor(@PathVariable Long id) {
        Contractor contractor = contractorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Contractor not found."));

        final Users user = contractor.getUser();

        // Send rejection email before deleting
        if (user != null) {
            emailService.sendContractorRejectedEmail(user.getEmail(), user.getUsername());
        }

        contractorRepository.delete(contractor);

        // Also delete the user login record
        if (user != null) {
            userRepository.delete(user);
        }

        return ResponseEntity.ok(new MessageResponse("Contractor deleted successfully!"));
    }
}
