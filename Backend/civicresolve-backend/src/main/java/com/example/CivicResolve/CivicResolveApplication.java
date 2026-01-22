package com.example.CivicResolve;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class CivicResolveApplication {

	public static void main(String[] args) {
		SpringApplication.run(CivicResolveApplication.class, args);
	}

}
