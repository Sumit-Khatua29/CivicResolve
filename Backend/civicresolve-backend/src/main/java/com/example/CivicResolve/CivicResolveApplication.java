package com.example.CivicResolve;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class CivicResolveApplication implements org.springframework.boot.CommandLineRunner {

	public static void main(String[] args) {
		System.setProperty("java.net.preferIPv4Stack", "true");
		SpringApplication.run(CivicResolveApplication.class, args);
	}

	@org.springframework.beans.factory.annotation.Value("${spring.mail.host}")
	private String mailHost;

	@org.springframework.beans.factory.annotation.Value("${spring.mail.port}")
	private String mailPort;

	@org.springframework.beans.factory.annotation.Value("${spring.mail.username}")
	private String mailUsername;

	@org.springframework.beans.factory.annotation.Value("${spring.mail.properties.mail.smtp.ssl.enable}")
	private String sslEnable;

	@org.springframework.beans.factory.annotation.Value("${spring.mail.properties.mail.smtp.starttls.enable}")
	private String startTlsEnable;

	@Override
	public void run(String... args) throws Exception {
		System.out.println("==========================================");
		System.out.println("   EMAIL CONFIGURATION CHECK");
		System.out.println("==========================================");
		System.out.println("Host: " + mailHost);
		System.out.println("Port: " + mailPort);
		System.out.println("Username: " + mailUsername);
		System.out.println("SSL Enable: " + sslEnable);
		System.out.println("StartTLS Enable: " + startTlsEnable);
		System.out.println("==========================================");
	}

}
