package com.hostel.complaints.controller;

import com.hostel.complaints.model.User;
import com.hostel.complaints.model.Complaint;
import com.hostel.complaints.service.UserService;
import com.hostel.complaints.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

//@CrossOrigin(origins = "http://localhost:5173")
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private ComplaintService complaintService;

    // ---------- Admin Login ----------
    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody User loginRequest) {
        try {
            User admin = userService.loginAdmin(loginRequest.getEmail(), loginRequest.getPassword());
            return ResponseEntity.ok(admin);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).build();
        }
    }

    // ---------- Get all complaints ----------
    @GetMapping("/complaints")
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        List<Complaint> complaints = complaintService.getAllComplaints();
        return ResponseEntity.ok(complaints);
    }

    // ---------- Update complaint status ----------
    @PutMapping("/complaints/{id}")
    public ResponseEntity<Complaint> updateComplaintStatus(@PathVariable Long id,
                                                           @RequestParam String status) {
        Complaint updated = complaintService.updateStatus(id, status);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }
}
