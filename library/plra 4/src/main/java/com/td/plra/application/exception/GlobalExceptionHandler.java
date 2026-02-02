package com.td.plra.application.exception;

import com.td.plra.application.utils.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(PLRAException.class)
    public ResponseEntity<ApiResponse<Void>> handlePLRAException(
            PLRAException ex, HttpServletRequest request) {
        log.error("PLRAException: {} - Path: {}", ex.getMessage(), request.getRequestURI(), ex);
        return ApiResponse.error(ex.getHttpStatus(), request.getRequestURI(), ex.toError());
    }
    
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleEntityNotFoundException(
            EntityNotFoundException ex, HttpServletRequest request) {
        log.warn("EntityNotFoundException: {} - Path: {}", ex.getMessage(), request.getRequestURI());
        return ApiResponse.error(HttpStatus.NOT_FOUND, request.getRequestURI(), ex.toError());
    }
    
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadRequestException(
            BadRequestException ex, HttpServletRequest request) {
        log.warn("BadRequestException: {} - Path: {}", ex.getMessage(), request.getRequestURI());
        return ApiResponse.error(HttpStatus.BAD_REQUEST, request.getRequestURI(), ex.toError());
    }
    
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotFoundException(
            NotFoundException ex, HttpServletRequest request) {
        log.warn("NotFoundException: {} - Path: {}", ex.getMessage(), request.getRequestURI());
        return ApiResponse.error(HttpStatus.NOT_FOUND, request.getRequestURI(), ex.toError());
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(
            MethodArgumentNotValidException ex, HttpServletRequest request) {
        
        List<PLRAError.AdditionalStatus> validationErrors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(this::mapFieldError)
                .collect(Collectors.toList());
        
        PLRAError error = PLRAError.builder()
                .serverStatusCode(String.valueOf(HttpStatus.BAD_REQUEST.value()))
                .severity(PLRAError.Severity.ERROR)
                .additionalStatus(validationErrors)
                .build();
        
        log.warn("Validation failed: {} errors - Path: {}", validationErrors.size(), request.getRequestURI());
        return ApiResponse.error(HttpStatus.BAD_REQUEST, request.getRequestURI(), error);
    }
    
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleIllegalArgumentException(
            IllegalArgumentException ex, HttpServletRequest request) {
        log.warn("IllegalArgumentException: {} - Path: {}", ex.getMessage(), request.getRequestURI());
        
        PLRAError error = PLRAError.builder()
                .serverStatusCode(String.valueOf(HttpStatus.BAD_REQUEST.value()))
                .severity(PLRAError.Severity.ERROR)
                .additionalStatus(List.of(PLRAError.AdditionalStatus.builder()
                        .statusCode("INVALID_ARGUMENT")
                        .statusDescription(ex.getMessage())
                        .severity(PLRAError.Severity.ERROR)
                        .build()))
                .build();
        
        return ApiResponse.error(HttpStatus.BAD_REQUEST, request.getRequestURI(), error);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGenericException(
            Exception ex, HttpServletRequest request) {
        log.error("Unexpected error: {} - Path: {}", ex.getMessage(), request.getRequestURI(), ex);
        
        PLRAError error = PLRAError.builder()
                .serverStatusCode(String.valueOf(HttpStatus.INTERNAL_SERVER_ERROR.value()))
                .severity(PLRAError.Severity.ERROR)
                .additionalStatus(List.of(PLRAError.AdditionalStatus.builder()
                        .statusCode("INTERNAL_ERROR")
                        .statusDescription("An unexpected error occurred")
                        .severity(PLRAError.Severity.ERROR)
                        .build()))
                .build();
        
        return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, request.getRequestURI(), error);
    }
    
    private PLRAError.AdditionalStatus mapFieldError(FieldError fieldError) {
        return PLRAError.AdditionalStatus.builder()
                .statusCode("VALIDATION_ERROR")
                .statusDescription(String.format("Field '%s': %s", 
                        fieldError.getField(), 
                        fieldError.getDefaultMessage()))
                .severity(PLRAError.Severity.ERROR)
                .build();
    }
}
