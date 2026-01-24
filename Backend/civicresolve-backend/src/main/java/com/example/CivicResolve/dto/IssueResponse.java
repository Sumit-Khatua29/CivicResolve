package com.example.CivicResolve.dto;

import com.example.CivicResolve.Model.Category;
import com.example.CivicResolve.Model.IssueStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class IssueResponse {
    private Long id;
    private String description;
    private String address;
    private String pincode;
    private Category category;
    private String otherCategory;
    private Double latitude;
    private Double longitude;
    private String imagePath;
    private IssueStatus status;
    private LocalDateTime createdAt;
    private String reportedBy;
    private String remark;
    private LocalDateTime updatedAt;
    private String beforeImagePath;
    private String afterImagePath;
}
