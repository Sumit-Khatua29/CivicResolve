package com.example.CivicResolve.dto;

import com.example.CivicResolve.Model.Category;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CategoryCount {
    private Category category;
    private Long count;
}
