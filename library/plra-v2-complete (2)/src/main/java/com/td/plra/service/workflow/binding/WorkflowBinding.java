package com.td.plra.service.workflow.binding;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.td.plra.application.utils.BaseBinding;
import com.td.plra.persistence.entity.QWorkflow;
import com.td.plra.persistence.enums.RateStatus;
import com.td.plra.persistence.enums.RateType;
import com.td.plra.persistence.enums.WorkflowAction;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class WorkflowBinding extends BaseBinding {
    
    private static final QWorkflow workflow = QWorkflow.workflow;
    
    public BooleanExpression buildPredicate(Map<String, String> params) {
        BooleanExpression predicate = null;
        
        // Global search across changeBy (OR condition). changeId is Long, not searchable by text.
        if (hasParam(params, "search")) {
            String searchTerm = getParam(params, "search");
            BooleanExpression searchPredicate = workflow.changeBy.containsIgnoreCase(searchTerm);
            // Also try to match changeId if search term is numeric
            Long searchId = parseLong(searchTerm);
            if (searchId != null) {
                searchPredicate = searchPredicate.or(workflow.changeId.eq(searchId));
            }
            predicate = and(predicate, searchPredicate);
        }
        
        if (hasParam(params, "rateType")) {
            RateType rateType = RateType.valueOf(getParam(params, "rateType").toUpperCase());
            predicate = and(predicate, workflow.rateType.eq(rateType));
        }
        
        if (hasParam(params, "rateStatus")) {
            RateStatus rateStatus = RateStatus.valueOf(getParam(params, "rateStatus").toUpperCase());
            predicate = and(predicate, workflow.rateStatus.eq(rateStatus));
        }
        
        if (hasParam(params, "action")) {
            WorkflowAction action = WorkflowAction.valueOf(getParam(params, "action").toUpperCase());
            predicate = and(predicate, workflow.action.eq(action));
        }
        
        Long rateId = parseLong(params.get("rateId"));
        if (rateId != null) {
            predicate = and(predicate, workflow.rateId.eq(rateId));
        }
        
        if (hasParam(params, "changeId")) {
            Long changeIdValue = parseLong(getParam(params, "changeId"));
            if (changeIdValue != null) {
                predicate = and(predicate, workflow.changeId.eq(changeIdValue));
            }
        }
        
        if (hasParam(params, "changeBy")) {
            predicate = and(predicate, workflow.changeBy.containsIgnoreCase(getParam(params, "changeBy")));
        }
        
        predicate = and(predicate, dateRange(params, "changeFrom", "changeTo",
                (start, end) -> workflow.changeOn.between(start, end)));
        
        predicate = and(predicate, dateRange(params, "createdFrom", "createdTo",
                (start, end) -> workflow.createdOn.between(start, end)));
        
        return predicate;
    }
}
