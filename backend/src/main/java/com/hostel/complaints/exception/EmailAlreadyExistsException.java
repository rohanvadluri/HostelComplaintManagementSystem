package com.hostel.complaints.exception;

// ------------ Custom Exception for Duplicate Email ------------
public class EmailAlreadyExistsException extends RuntimeException {
    public EmailAlreadyExistsException(String message) {
        super(message);
    }
}
