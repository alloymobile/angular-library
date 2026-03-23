package com.td.plra.application.exception;

import org.springframework.http.HttpStatus;

public class EntityNotFoundException extends PLRAException {
    
    public EntityNotFoundException(String entityName, Long id) {
        super(HttpStatus.NOT_FOUND, 
              String.valueOf(HttpStatus.NOT_FOUND.value()),
              PLRAError.Severity.ERROR,
              java.util.List.of(),
              String.format("%s not found with id: %d", entityName, id));
    }
    
    public EntityNotFoundException(String entityName, String identifier) {
        super(HttpStatus.NOT_FOUND,
              String.valueOf(HttpStatus.NOT_FOUND.value()),
              PLRAError.Severity.ERROR,
              java.util.List.of(),
              String.format("%s not found with identifier: %s", entityName, identifier));
    }
    
    public EntityNotFoundException(String message) {
        super(HttpStatus.NOT_FOUND, message);
    }
}
