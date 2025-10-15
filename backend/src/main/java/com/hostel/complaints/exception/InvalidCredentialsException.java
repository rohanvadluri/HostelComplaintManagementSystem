package com.hostel.complaints.exception;

// ------------ Custom Exception for Invalid Login ------------
public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException(String message) {
        super(message);
    }
}
