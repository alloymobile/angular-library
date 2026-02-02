package com.td.plra.service.workflow.dto;

import com.td.plra.persistence.enums.RateStatus;
import com.td.plra.persistence.enums.RateType;
import com.td.plra.persistence.enums.WorkflowAction;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkflowInput {
    
    private Long id;
    
    @NotNull(message = "Rate type is required")
    private RateType rateType;
    
    @NotNull(message = "Rate ID is required")
    private Long rateId;
    
    @NotNull(message = "Action is required")
    private WorkflowAction action;
    
    private RateStatus fromStatus;
    
    @NotNull(message = "To status is required")
    private RateStatus toStatus;
    
    private String changeId;
}
