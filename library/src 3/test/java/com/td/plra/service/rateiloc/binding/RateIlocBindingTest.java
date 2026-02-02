package com.td.plra.service.rateiloc.binding;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.RateStatus;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("RateIlocBinding predicate builders")
class RateIlocBindingTest {

    private final RateIlocBinding binding = new RateIlocBinding();

    @Test
    void draftPredicate_shouldDefaultToActiveYesWhenActiveNotProvided() {
        BooleanExpression predicate = binding.buildDraftPredicate(new HashMap<>());
        assertThat(predicate).isNotNull();
        assertThat(predicate.toString()).contains(ActiveStatus.Y.name());
    }

    @Test
    void draftPredicate_shouldIncludeStatusWhenProvided() {
        Map<String, String> params = new HashMap<>();
        params.put("status", RateStatus.DRAFT.name());
        BooleanExpression predicate = binding.buildDraftPredicate(params);
        assertThat(predicate).isNotNull();
        assertThat(predicate.toString()).contains(RateStatus.DRAFT.name());
    }

    @Test
    void activePredicate_shouldHandleCurrentTrueFlag() {
        Map<String, String> params = new HashMap<>();
        params.put("current", "true");
        BooleanExpression predicate = binding.buildActivePredicate(params);
        assertThat(predicate).isNotNull();
        // current=true adds a "today between startDate and expiryDate" clause
        assertThat(predicate.toString()).contains("startDate").contains("expiryDate");
    }

    @Test
    void historyPredicate_shouldIncludeChangeIdWhenProvided() {
        Map<String, String> params = new HashMap<>();
        params.put("changeId", "CHG-123");
        BooleanExpression predicate = binding.buildHistoryPredicate(params);
        assertThat(predicate).isNotNull();
        assertThat(predicate.toString()).contains("changeId");
    }
}
