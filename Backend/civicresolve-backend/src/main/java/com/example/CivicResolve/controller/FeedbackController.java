package com.example.CivicResolve.controller;


import com.example.CivicResolve.Model.Feedback;
import com.example.CivicResolve.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @PostMapping
    public ResponseEntity<?> submitFeedback(@RequestBody Feedback feedback) {
        feedbackRepository.save(feedback);
        return ResponseEntity.ok("Feedback submitted successfully");
    }
}
