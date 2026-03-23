package com.td.plra.application.utils;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.td.plra.application.exception.PLRAError;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.net.URI;
import java.time.Instant;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    
    private boolean success;
    private T data;
    private String path;
    private String timestamp;
    private PLRAError status;  // present only on errors
    
    public ApiResponse() {
        this.timestamp = Instant.now().toString();
    }
    
    public static <T> ResponseEntity<ApiResponse<T>> ok(T body) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setData(body);
        return ResponseEntity.ok(response);
    }
    
    public static <T> ResponseEntity<ApiResponse<T>> created(URI location, T body) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setData(body);
        return ResponseEntity.created(location).body(response);
    }
    
    public static <T> ResponseEntity<ApiResponse<T>> created(T body) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setData(body);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    public static <T> ResponseEntity<ApiResponse<T>> noContent() {
        ApiResponse<T> response = new ApiResponse<>();
        response.setSuccess(true);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(response);
    }
    
    public static <T> ResponseEntity<ApiResponse<T>> error(
            HttpStatus httpStatus, String requestPath, PLRAError error) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setSuccess(false);
        response.setStatus(error);
        response.setPath(requestPath);
        return ResponseEntity.status(httpStatus).body(response);
    }
    
    public static <T> ResponseEntity<ApiResponse<T>> accepted(T body) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setData(body);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
    }
}
