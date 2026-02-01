package com.td.plra.application.exception;

import org.springframework.http.HttpStatus;

import java.util.List;

public class NotFoundException extends PLRAException {
    
    public NotFoundException(String message) {
        super(HttpStatus.NOT_FOUND,
              String.valueOf(HttpStatus.NOT_FOUND.value()),
              PLRAError.Severity.ERROR,
              List.of(),
              message);
    }
    
    public NotFoundException(String resourceType, String resourceIdentifier) {
        super(HttpStatus.NOT_FOUND,
              String.valueOf(HttpStatus.NOT_FOUND.value()),
              PLRAError.Severity.ERROR,
              List.of(PLRAError.AdditionalStatus.builder()
                      .statusCode("RESOURCE_NOT_FOUND")
                      .statusDescription(String.format("%s with identifier '%s' not found", resourceType, resourceIdentifier))
                      .severity(PLRAError.Severity.ERROR)
                      .build()),
              String.format("%s not found: %s", resourceType, resourceIdentifier));
    }
}
