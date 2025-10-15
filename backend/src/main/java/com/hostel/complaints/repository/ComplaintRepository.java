package com.hostel.complaints.repository;

import com.hostel.complaints.model.Complaint;
import com.hostel.complaints.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    // For Student specific complaints
    List<Complaint> findByUser(User user);
}
