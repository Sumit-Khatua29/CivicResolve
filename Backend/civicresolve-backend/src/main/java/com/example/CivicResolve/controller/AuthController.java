package com.example.CivicResolve.controller;

import com.example.CivicResolve.Model.Role;
import com.example.CivicResolve.Model.Users;
import com.example.CivicResolve.dto.*;
import com.example.CivicResolve.repository.ContractorRepository;
import com.example.CivicResolve.repository.UserRepository;
import com.example.CivicResolve.security.JwtUtils;
import com.example.CivicResolve.security.UserDetailsImpl;
import com.example.CivicResolve.service.CaptchaService;
import com.example.CivicResolve.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;


@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ContractorRepository contractorRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    EmailService emailService;

    @Autowired
    CaptchaService captchaService;

    @GetMapping("/captcha")
    public ResponseEntity<CaptchaResponse> getCaptcha() {
        Map<String, String> captcha = captchaService.generateCaptcha();
        return ResponseEntity.ok(new CaptchaResponse(captcha.get("id"), captcha.get("question")));
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        System.out.println("Login Request for: " + loginRequest.getUsername());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(item -> item.getAuthority())
                .orElse("ROLE_CITIZEN");

        return ResponseEntity.ok().body(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                role));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        long start = System.currentTimeMillis();
        System.out.println("AuthController: registerUser started for " + signUpRequest.getUsername());

        // Manual validation for Contractor fields
        // Validate Full Name, Phone Number, and Address for ALL roles
        String fullName = signUpRequest.getFullName();
        if (fullName == null || fullName.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Full Name is required"));
        }
        if (!fullName.matches("^[a-zA-Z\\s]+$")) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Full Name must contain only letters and spaces"));
        }

        String phoneNumber = signUpRequest.getPhoneNumber();
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Phone Number is required"));
        }
        if (!phoneNumber.matches("^\\d{10}$")) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Phone Number must be exactly 10 digits"));
        }

        if (signUpRequest.getAddress() == null || signUpRequest.getAddress().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Address is required"));
        }

        if (!captchaService.validateCaptcha(signUpRequest.getCaptchaId(), signUpRequest.getCaptchaAnswer())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid Captcha"));
        }

        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        if (signUpRequest.getRole() == Role.ROLE_ADMIN && userRepository.existsByRole(Role.ROLE_ADMIN)) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Admin account already exists. Only one admin is allowed."));
        }
        // Create new user's account
        Users user = new Users();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));

        // maximize data capture for all roles
        user.setFullName(signUpRequest.getFullName());
        user.setPhoneNumber(signUpRequest.getPhoneNumber());
        user.setAddress(signUpRequest.getAddress());

        // Default role is Citizen, or use request role if valid
        if (signUpRequest.getRole() != null) {
            user.setRole(signUpRequest.getRole());
        } else {
            user.setRole(Role.ROLE_CITIZEN);
        }

        // Disable account if Contractor (requires admin approval)
        if (user.getRole() == Role.ROLE_CONTRACTOR) {
            user.setEnabled(false);
        } else {
            user.setEnabled(true);
        }

        userRepository.save(user);

        if (user.getRole() == Role.ROLE_CONTRACTOR) {
            String area = signUpRequest.getAssignedArea();
            if (area == null || !area.matches("^[1-9][0-9]{5}$")) {
                 userRepository.delete(user); // Rollback user creation
                 return ResponseEntity.badRequest().body(new MessageResponse("Error: Assigned Area must be a valid 6-digit Pincode (cannot start with 0)"));
            }

            com.example.CivicResolve.Model.Contractor contractor = new com.example.CivicResolve.Model.Contractor();
            contractor.setUser(user);
            contractor.setAssignedArea(area);

            // Save personal details to Contractor table
            contractor.setFullName(signUpRequest.getFullName());
            contractor.setPhoneNumber(signUpRequest.getPhoneNumber());
            contractor.setAddress(signUpRequest.getAddress());

            contractorRepository.save(contractor);
        }

        // Send welcome email
        try
        {
            emailService.sendWelcomeEmail(user.getEmail(), user.getUsername());
        } catch (Exception e) {
            System.err.println("Failed to send welcome email: " + e.getMessage());
            // We don't want to fail registration if email fails, so we just log it
        }

        long duration = System.currentTimeMillis()
                - start;
        System.out.println("AuthController: registerUser completed in " + duration + "ms");
        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> payload) {
        String token = payload.get("token");

        // Verify token with Google
        RestTemplate restTemplate = new RestTemplate();
        String googleUrl = "https://www.googleapis.com/oauth2/v3/userinfo";
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<String> entity = new HttpEntity<>("", headers);

        try {
            org.springframework.core.ParameterizedTypeReference<Map<String, Object>> typeRef = new org.springframework.core.ParameterizedTypeReference<Map<String, Object>>() {};
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(googleUrl, HttpMethod.GET, entity, typeRef);
            Map<String, Object> userData = response.getBody();

            if (userData == null || userData.get("email") == null) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid Google Token"));
            }

            String email = (String) userData.get("email");
            String name = (String) userData.get("name");

            // Check if user exists
            Users user = userRepository.findByEmail(email).orElse(null);

            if (user == null) {
                // Register new user
                user = new Users();
                String safeName = (name != null ? name : "user").replaceAll("[^a-zA-Z0-9]", "");
                if (safeName.isEmpty())
                    safeName = "user";
                user.setUsername(safeName + "_" + (System.currentTimeMillis() % 10000));

                user.setEmail(email);
                user.setPassword(encoder.encode(UUID.randomUUID().toString())); // Random password
                user.setRole(Role.ROLE_CITIZEN);
                userRepository.save(user);

                // Send welcome email
                try {
                    emailService.sendWelcomeEmail(user.getEmail(), user.getUsername());
                } catch (Exception e) {
                    System.err.println("Failed to send welcome email: " + e.getMessage());
                }
            }

            // Check if account is active (specifically for Contractors)
            if (user.getRole() == Role.ROLE_CONTRACTOR && !user.isEnabled()) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Account is pending approval"));
            }

            // Generate JWT
            UserDetailsImpl userDetails = new UserDetailsImpl(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getPassword(),
                    user.isEnabled(), // Use actual enabled status
                    Collections.singletonList(new SimpleGrantedAuthority(user.getRole().name())));

            Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null,
                    userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);

            String jwt = jwtUtils.generateJwtToken(authentication);

            return ResponseEntity.ok(new JwtResponse(jwt,
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getEmail(),
                    userDetails.getAuthorities().stream().findFirst().map(item -> item.getAuthority())
                            .orElse("ROLE_CITIZEN")));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Google Login Failed: " + e.getMessage()));
        }
    }



    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is required"));
        }

        Users user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            // To prevent user enumeration, we can return OK even if user not found, 
            // but for this project context, explicit error might be preferred by user. 
            // I'll return bad request for now as it's easier for them to debug.
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User with this email does not exist."));
        }

        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        // Expiry 15 minutes from now
        user.setResetTokenExpiry(java.time.LocalDateTime.now().plusMinutes(15));
        try {
            userRepository.save(user);
        } catch (Exception e) {
            System.err.println("Error saving user with reset token: " + e.getMessage());
            e.printStackTrace();
            if (e instanceof org.springframework.transaction.TransactionSystemException) {
                 Throwable cause = e.getCause();
                 while (cause != null) {
                     System.err.println("Cause: " + cause.getMessage());
                     cause = cause.getCause();
                 }
            }
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Could not commit JPA transaction. Check logs for validation errors."));
        }

        emailService.sendPasswordResetEmail(user.getEmail(), token);

        return ResponseEntity.ok(new MessageResponse("Password reset email sent!"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> payload) {
        String token = payload.get("token");
        String newPassword = payload.get("newPassword");

        if (token == null || newPassword == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Token and New Password are required"));
        }

        Optional<Users> userOpt = userRepository.findByResetToken(token);
       if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid token"));
        }

        Users user = userOpt.get();

        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(java.time.LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Token has expired"));
        }

        // Validate password strength here if needed, or rely on frontend validation + common sense
        if (newPassword.length() < 6) {
             return ResponseEntity.badRequest().body(new MessageResponse("Error: Password must be at least 6 characters"));
        }

        user.setPassword(encoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Password successfully reset! You can now login."));
    }

}
