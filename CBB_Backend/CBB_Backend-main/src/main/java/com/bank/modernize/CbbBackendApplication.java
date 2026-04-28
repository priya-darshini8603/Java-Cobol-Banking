package com.bank.modernize;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.bank.modernize")

public class CbbBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(CbbBackendApplication.class, args);
	}

}
