package com.td.plra.service.notification.binding;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.NotificationStatus;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("NotificationBinding predicate builder")
class NotificationBindingTest {

    private final NotificationBinding binding = new NotificationBinding();

    @Test
    void shouldDefaultToActiveYesWhenActiveNotProvided() {
        BooleanExpression predicate = binding.buildPredicate(new HashMap<>());
        assertThat(predicate).isNotNull();
        assertThat(predicate.toString()).contains(ActiveStatus.Y.name());
    }

    @Test
    void shouldIncludeStatusWhenProvided() {
        Map<String, String> params = new HashMap<>();
        params.put("status", NotificationStatus.NEW.name());
        BooleanExpression predicate = binding.buildPredicate(params);
        assertThat(predicate).isNotNull();
        assertThat(predicate.toString()).contains(NotificationStatus.NEW.name());
    }
}
