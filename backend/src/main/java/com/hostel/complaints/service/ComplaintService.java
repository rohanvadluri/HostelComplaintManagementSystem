package com.hostel.complaints.service;

import com.hostel.complaints.model.Complaint;
import com.hostel.complaints.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    // Create complaint
    public Complaint createComplaint(Complaint complaint) {
        return complaintRepository.save(complaint);
    }

    // Get complaints by user
    public java.util.List<Complaint> getComplaintsByUser(com.hostel.complaints.model.User user) {
        return complaintRepository.findByUser(user);
    }

    // ---------------- Update Status ----------------
    public Complaint updateStatus(Long complaintId, String status) {
        Optional<Complaint> opt = complaintRepository.findById(complaintId);
        if(opt.isPresent()) {
            Complaint c = opt.get();
            c.setStatus(status);
            return complaintRepository.save(c);
        }
        throw new RuntimeException("Complaint not found with ID: " + complaintId);
    }

    // Get all complaints (for admin)
    public java.util.List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }
}
