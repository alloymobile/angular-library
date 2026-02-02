package com.td.plra.service.workflow.dto;

import com.td.plra.persistence.enums.RateStatus;
import com.td.plra.persistence.enums.RateType;
import com.td.plra.persistence.enums.WorkflowAction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkflowAdminView {
    
    private Long id;
    private RateType rateType;
    private RateStatus rateStatus;
    private Long rateId;
    private String changeId;
    private WorkflowAction action;
    private String changeBy;
    private LocalDateTime changeOn;
    private RateStatus fromStatus;
    private RateStatus toStatus;
    private String createdBy;
    private LocalDateTime createdOn;
    private String updatedBy;
    private LocalDateTime updatedOn;
    private Long version;
}
