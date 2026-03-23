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
public class WorkflowUserView {

    private Long id;
    private RateType rateType;
    private Long rateId;
    private WorkflowAction action;
    private RateStatus fromStatus;
    private RateStatus toStatus;
    private String message;
    private LocalDateTime changeOn;
}
