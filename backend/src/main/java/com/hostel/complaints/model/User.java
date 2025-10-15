package com.hostel.complaints.model;
//1️⃣ User Entity (Student/Admin)
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor

@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    @ToString.Exclude
    private String password;

    private String role; // STUDENT or ADMIN

}
