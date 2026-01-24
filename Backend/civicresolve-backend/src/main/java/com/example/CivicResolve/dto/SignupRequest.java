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

    private String fullName;

    private String phoneNumber;

    private String address;
}
