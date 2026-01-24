package com.example.CivicResolve.Model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @jakarta.validation.constraints.NotNull(message = "Rating is required")
    @jakarta.validation.constraints.Min(value = 1, message = "Rating must be at least 1")
    @jakarta.validation.constraints.Max(value = 5, message = "Rating must be at most 5")
    private Integer rating; // 1 to 5

    @Column(length = 1000)
    @jakarta.validation.constraints.Size(max = 1000, message = "Comment too long")
    private String comment;

    @jakarta.validation.constraints.NotNull(message = "Issue ID is required")
    private Integer issueId;

    private LocalDateTime createdAt = LocalDateTime.now();
}