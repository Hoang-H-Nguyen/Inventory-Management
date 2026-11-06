package com.stockmate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;

@SpringBootApplication(exclude = UserDetailsServiceAutoConfiguration.class)
public class StockMateApplication {
    public static void main(String[] args) {
        SpringApplication.run(StockMateApplication.class, args);
    }
}
