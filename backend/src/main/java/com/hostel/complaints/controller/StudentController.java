package com.hostel.complaints.controller;

import com.hostel.complaints.model.Complaint;
import com.hostel.complaints.model.User;
import com.hostel.complaints.service.ComplaintService;
import com.hostel.complaints.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

//@CrossOrigin(origins = "http://localhost:5173")  // React front-end
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private UserService userService;

    @Autowired
    private ComplaintService complaintService;

    // ---------- Register Student ----------
    @PostMapping("/register")
    public ResponseEntity<User> registerStudent(@RequestBody User user) {
        user.setRole("STUDENT");
        User savedUser = userService.registerUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }
    // ------------ Login Student ------------
    @PostMapping("/login")
    public ResponseEntity<User> loginStudent(@RequestBody User user) {
        User loggedInUser = userService.loginStudent(user.getEmail(), user.getPassword());
        return ResponseEntity.ok(loggedInUser);
    }

    // ---------- Raise Complaint ----------
    @PostMapping("/{studentId}/complaints")
    public ResponseEntity<Complaint> raiseComplaint(@PathVariable Long studentId,
                                                    @RequestBody Complaint complaint) {
        Optional<User> userOpt = userService.getUserById(studentId);
        if (userOpt.isPresent()) {
            complaint.setUser(userOpt.get());
            complaint.setStatus("PENDING");
            Complaint savedComplaint = complaintService.createComplaint(complaint);
            return ResponseEntity.ok(savedComplaint);
        }
        return ResponseEntity.badRequest().body(null);
    }

    // ---------- Get Complaints of a Student ----------
    @GetMapping("/{studentId}/complaints")
    public ResponseEntity<List<Complaint>> getStudentComplaints(@PathVariable Long studentId) {
        Optional<User> userOpt = userService.getUserById(studentId);
        if (userOpt.isPresent()) {
            List<Complaint> complaints = complaintService.getComplaintsByUser(userOpt.get());
            return ResponseEntity.ok(complaints);
        }
        return ResponseEntity.notFound().build();
    }
}
