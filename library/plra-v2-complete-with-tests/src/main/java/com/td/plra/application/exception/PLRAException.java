package com.td.plra.application.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.util.List;

@Getter
public class PLRAException extends RuntimeException {
    
    private final HttpStatus httpStatus;
    private final String serverStatusCode;
    private final PLRAError.Severity severity;
    private final List<PLRAError.AdditionalStatus> additionalStatus;
    
    public PLRAException(
            HttpStatus httpStatus,
            String serverStatusCode,
            PLRAError.Severity severity,
            List<PLRAError.AdditionalStatus> additionalStatus,
            String message) {
        super(message);
        this.httpStatus = httpStatus;
        this.serverStatusCode = serverStatusCode;
        this.severity = severity;
        this.additionalStatus = additionalStatus;
    }
    
    public PLRAException(HttpStatus httpStatus, String message) {
        this(httpStatus, String.valueOf(httpStatus.value()), PLRAError.Severity.ERROR, List.of(), message);
    }
    
    public PLRAException(HttpStatus httpStatus, PLRAError.Severity severity, String message) {
        this(httpStatus, String.valueOf(httpStatus.value()), severity, List.of(), message);
    }
    
    public PLRAError toError() {
        return PLRAError.builder()
                .serverStatusCode(serverStatusCode)
                .severity(severity)
                .additionalStatus(additionalStatus)
                .build();
    }
}
