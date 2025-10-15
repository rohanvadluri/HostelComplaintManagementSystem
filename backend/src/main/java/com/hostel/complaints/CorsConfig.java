package com.hostel.complaints;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {
    // This bean sets the allowed frontend origin (your React app URL)
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // allow all endpoints/API paths
                        .allowedOrigins("http://localhost:5173") // your React app URL
                        .allowedOrigins("*")
//                        .allowedOrigins("https://your-frontend-name.vercel.app") // your React app URL from Vercel
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")//allow all HTTP methods
                        .allowedHeaders("*");
            }
        };
    }
}
