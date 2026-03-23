package com.td.plra.application.exception;

import org.springframework.http.HttpStatus;

import java.util.List;

public class BadRequestException extends PLRAException {
    
    public BadRequestException(String message) {
        super(HttpStatus.BAD_REQUEST,
              String.valueOf(HttpStatus.BAD_REQUEST.value()),
              PLRAError.Severity.ERROR,
              List.of(),
              message);
    }
    
    public BadRequestException(String message, List<PLRAError.AdditionalStatus> additionalStatus) {
        super(HttpStatus.BAD_REQUEST,
              String.valueOf(HttpStatus.BAD_REQUEST.value()),
              PLRAError.Severity.ERROR,
              additionalStatus,
              message);
    }
    
    public BadRequestException(String field, String reason) {
        super(HttpStatus.BAD_REQUEST,
              String.valueOf(HttpStatus.BAD_REQUEST.value()),
              PLRAError.Severity.ERROR,
              List.of(PLRAError.AdditionalStatus.builder()
                      .statusCode("VALIDATION_ERROR")
                      .statusDescription(String.format("Field '%s': %s", field, reason))
                      .severity(PLRAError.Severity.ERROR)
                      .build()),
              String.format("Validation failed for field '%s': %s", field, reason));
    }
}
