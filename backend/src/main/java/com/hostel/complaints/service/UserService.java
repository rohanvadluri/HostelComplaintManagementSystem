package com.hostel.complaints.service;
import com.hostel.complaints.exception.InvalidCredentialsException;
import com.hostel.complaints.model.User;
import com.hostel.complaints.repository.UserRepository;
import com.hostel.complaints.exception.EmailAlreadyExistsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
// ------------ Service Layer for User Management ------------
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // -------- Register a Student with Duplicate Email Check ------------
    public User registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("This email is already registered!");
        }
        user.setRole("STUDENT");
        return userRepository.save(user);
    }

    // ------------ Login Student ------------
    public User loginStudent(String email, String password) {
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));
//for password
        if (!student.getPassword().equals(password)) {
            throw new InvalidCredentialsException("Invalid password");
        }

        return student;
    }


    // Login admin
    public User loginAdmin(String email, String password) {
        // 1️⃣ Find user by email
        User admin = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid admin credentials"));

        // 2️⃣ Check role and password
        if (!"ADMIN".equals(admin.getRole()) || !admin.getPassword().equals(password)) {
            throw new RuntimeException("Invalid admin credentials");
        }

        // 3️⃣ Login successful
        return admin;
    }

    // Get user by ID
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
}
