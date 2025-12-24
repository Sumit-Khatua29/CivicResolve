package com.example.CivicResolve.controller;

import com.example.CivicResolve.Model.Role;
import com.example.CivicResolve.Model.Users;
import com.example.CivicResolve.dto.*;
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
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

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

        // Default role is Citizen, or use request role if valid
        if (signUpRequest.getRole() != null) {
            user.setRole(signUpRequest.getRole());
        } else {
            user.setRole(Role.ROLE_CITIZEN);
        }

        userRepository.save(user);

        // Send welcome email
        try {
            emailService.sendWelcomeEmail(user.getEmail(), user.getUsername());
        } catch (Exception e) {
            System.err.println("Failed to send welcome email: " + e.getMessage());
            // We don't want to fail registration if email fails, so we just log it
        }

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
            ResponseEntity<Map> response = restTemplate.exchange(googleUrl, HttpMethod.GET, entity, Map.class);
            Map<String, Object> userData = (Map<String, Object>) response.getBody();

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
                if (safeName.isEmpty()) safeName = "user";
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

            // Generate JWT
            UserDetailsImpl userDetails = new UserDetailsImpl(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getPassword(),
                    true, // enabled
                    Collections.singletonList(new SimpleGrantedAuthority(user.getRole().name())));

            Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);

            String jwt = jwtUtils.generateJwtToken(authentication);

            return ResponseEntity.ok(new JwtResponse(jwt,
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getEmail(),
                    userDetails.getAuthorities().stream().findFirst().map(item -> item.getAuthority()).orElse("ROLE_CITIZEN")));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Google Login Failed: " + e.getMessage()));
        }
    }

}
