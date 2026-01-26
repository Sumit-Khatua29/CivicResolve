package com.example.CivicResolve.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "Issues")
@AllArgsConstructor
@NoArgsConstructor
public class Issue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    @jakarta.validation.constraints.NotBlank(message = "Description cannot be blank")
    private String description;

    @Column(length = 500)
    @jakarta.validation.constraints.NotBlank(message = "Address cannot be blank")
    @jakarta.validation.constraints.Size(max = 500, message = "Address too long")
    private String address;

    @Column(length = 10)
    @jakarta.validation.constraints.NotBlank(message = "Pincode is required")
    @jakarta.validation.constraints.Pattern(regexp = "^\\d{6}$", message = "Pincode must be 6 digits")
    private String pincode;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(255)")
    @jakarta.validation.constraints.NotNull(message = "Category is required")
    private Category category;

    private String otherCategory;

    @jakarta.validation.constraints.NotNull(message = "Latitude is required")
    private Double latitude;

    @jakarta.validation.constraints.NotNull(message = "Longitude is required")
    private Double longitude;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "image_data", columnDefinition = "LONGBLOB")
    private byte[] imageData;

    private String imageType;

    private String imageName;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(columnDefinition = "LONGBLOB")
    private byte[] beforeImageData;
    private String beforeImageType;
    private String beforeImageName;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(columnDefinition = "LONGBLOB")
    private byte[] afterImageData;
    private String afterImageType;
    private String afterImageName;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private IssueStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String remark;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Users user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contractor_id")
    private Contractor contractor;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        status = IssueStatus.PENDING;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
