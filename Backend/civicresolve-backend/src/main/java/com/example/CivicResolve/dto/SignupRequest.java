package com.example.CivicResolve.dto;

import com.example.CivicResolve.Model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignupRequest {
    @NotBlank
    @Size(min = 3, max = 20)
    private String username;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    private Role role;

    @NotBlank
    @Size(min = 6, max = 12)
    private String password;

    private String captchaId;

    private String captchaAnswer;

    private String assignedArea;

    @NotBlank(message = "Full Name cannot be blank")
    @Size(min = 3, max = 100, message = "Full Name must be between 3 and 100 characters")
    @jakarta.validation.constraints.Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Full Name must contain only letters and spaces")
    private String fullName;

    @NotBlank(message = "Phone Number cannot be blank")
    @jakarta.validation.constraints.Pattern(regexp = "^\\d{10}$", message = "Phone Number must be exactly 10 digits")
    private String phoneNumber;

    @NotBlank(message = "Address cannot be blank")
    private String address;
}
