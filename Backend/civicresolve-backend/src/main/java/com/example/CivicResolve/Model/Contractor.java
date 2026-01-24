package com.example.CivicResolve.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "Contractors")
@AllArgsConstructor
@NoArgsConstructor
public class Contractor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private Users user;

    @jakarta.validation.constraints.NotBlank(message = "Assigned Area cannot be blank")
    private String assignedArea;

    private String specialization;

    @jakarta.validation.constraints.NotBlank(message = "Full Name cannot be blank")
    @jakarta.validation.constraints.Size(min = 3, max = 100, message = "Full Name must be between 3 and 100 characters")
    @jakarta.validation.constraints.Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Full Name must contain only letters and spaces")
    private String fullName;

    @jakarta.validation.constraints.NotBlank(message = "Phone Number cannot be blank")
    @jakarta.validation.constraints.Pattern(regexp = "^\\d{10}$", message = "Phone Number must be exactly 10 digits")
    private String phoneNumber;

    @jakarta.validation.constraints.NotBlank(message = "Address cannot be blank")
    private String address;

    // Optional: Add other fields like licenseNumber if needed in future
}
