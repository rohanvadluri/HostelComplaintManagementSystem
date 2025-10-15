package com.hostel.complaints.repository;

import com.hostel.complaints.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // For Login
    Optional<User> findByEmail(String email);
}
