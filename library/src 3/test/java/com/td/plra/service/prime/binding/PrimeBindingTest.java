package com.td.plra.service.prime.binding;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.td.plra.persistence.enums.ActiveStatus;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.HashMap;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("PrimeBinding predicate builder")
class PrimeBindingTest {

    private final PrimeBinding binding = new PrimeBinding();

    @Test
    void shouldDefaultToActiveYesWhenActiveNotProvided() {
        BooleanExpression predicate = binding.buildPredicate(new HashMap<>());
        assertThat(predicate).isNotNull();
        assertThat(predicate.toString()).contains(ActiveStatus.Y.name());
    }
}
