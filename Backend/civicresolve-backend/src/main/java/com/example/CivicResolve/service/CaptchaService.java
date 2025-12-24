package com.example.CivicResolve.service;


import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CaptchaService {

    // Simple in-memory storage for captcha answers.
    // In a real production app, use Redis with expiration.
    private final Map<String, String> captchaStore = new ConcurrentHashMap<>();

    public Map<String, String> generateCaptcha() {
        int num1 = (int) (Math.random() * 10);
        int num2 = (int) (Math.random() * 10);
        String answer = String.valueOf(num1 + num2);
        String id = UUID.randomUUID().toString();
        String question = "What is " + num1 + " + " + num2 + "?";

        captchaStore.put(id, answer);

        // Simple cleanup: if map gets too big, clear it (very naive implementation for demo)
        if (captchaStore.size() > 1000) {
            captchaStore.clear();
        }

        return Map.of("id", id, "question", question);
    }

    public boolean validateCaptcha(String id, String answer) {
        if (id == null || answer == null) {
            return false;
        }
        String expectedAnswer = captchaStore.get(id);
        if (expectedAnswer != null && expectedAnswer.equals(answer)) {
            captchaStore.remove(id); // One-time use
            return true;
        }
        return false;
    }
}
