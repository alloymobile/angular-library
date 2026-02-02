package com.td.plra.application.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PLRAError {
    
    private String serverStatusCode;  // e.g. "401", "400", "500"
    
    private Severity severity;
    
    @Builder.Default
    private List<AdditionalStatus> additionalStatus = new ArrayList<>();
    
    public enum Severity {
        ERROR,
        WARNING,
        INFO
    }
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AdditionalStatus {
        private String statusCode;
        private String statusDescription;
        private Severity severity;
    }
}
