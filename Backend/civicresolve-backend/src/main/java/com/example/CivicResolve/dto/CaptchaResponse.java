package com.example.CivicResolve.dto;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CaptchaResponse {
    public String id;
    public String question;
}
