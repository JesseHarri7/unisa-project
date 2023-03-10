package com.altHealth;

import org.springframework.boot.*;
import org.springframework.boot.autoconfigure.*;
import org.springframework.web.bind.annotation.*;

@SpringBootApplication
@RestController
public class App {

	@GetMapping("/")
	String home() {
		return "Spring is here!";
	}

	public static void main(String[] args) {
		SpringApplication.run(App.class, args);
		System.out.println("SERVER ON");
		System.out.println("http://localhost:8080/altHealth/client/");
	}
}