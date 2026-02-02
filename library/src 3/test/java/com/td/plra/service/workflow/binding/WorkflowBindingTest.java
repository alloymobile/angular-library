package com.td.plra.service.workflow.binding;

import com.querydsl.core.types.dsl.BooleanExpression;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("WorkflowBinding predicate builder")
class WorkflowBindingTest {

    private final WorkflowBinding binding = new WorkflowBinding();

    @Test
    void shouldReturnNullWhenNoParamsProvided() {
        BooleanExpression predicate = binding.buildPredicate(new HashMap<>());
        assertThat(predicate).isNull();
    }

    @Test
    void shouldIncludeChangeIdAndActionWhenProvided() {
        Map<String, String> params = new HashMap<>();
        params.put("changeId", "CHG-1");
        params.put("action", "SUBMIT");
        BooleanExpression predicate = binding.buildPredicate(params);
        assertThat(predicate).isNotNull();
        assertThat(predicate.toString()).contains("changeId").contains("action");
    }
}
