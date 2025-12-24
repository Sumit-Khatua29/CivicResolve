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

    private Integer rating; // 1 to 5

    @Column(length = 1000)
    private String comment;

    private Integer issueId;

    private LocalDateTime createdAt = LocalDateTime.now();
}