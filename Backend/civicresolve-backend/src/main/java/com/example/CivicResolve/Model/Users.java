package com.example.CivicResolve.Model;

import jakarta.persistence.*;
import lombok.*;

@Data

@Table(name = "Citizens")
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    @jakarta.validation.constraints.NotBlank(message = "Username cannot be blank")
    @jakarta.validation.constraints.Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
    private String username;

    @Column(nullable = false, unique = true)
    @jakarta.validation.constraints.NotBlank(message = "Email cannot be blank")
    @jakarta.validation.constraints.Email(message = "Invalid email format")
    @jakarta.validation.constraints.Size(max = 50, message = "Email too long")
    private String email;

    @Column(nullable = false)
    @jakarta.validation.constraints.NotBlank(message = "Password cannot be blank")
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    @jakarta.validation.constraints.NotNull(message = "Role is required")
    private Role role;

    @jakarta.validation.constraints.NotBlank(message = "Full Name cannot be blank")
    @jakarta.validation.constraints.Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Full Name must contain only letters and spaces")
    private String fullName;

    @jakarta.validation.constraints.NotBlank(message = "Phone Number cannot be blank")
    @jakarta.validation.constraints.Pattern(regexp = "^\\d{10}$", message = "Phone Number must be exactly 10 digits")
    private String phoneNumber;

    @jakarta.validation.constraints.NotBlank(message = "Address cannot be blank")
    private String address;

    private boolean enabled = true;
}