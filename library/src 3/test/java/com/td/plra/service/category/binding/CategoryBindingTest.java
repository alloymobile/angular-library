package com.td.plra.service.category.binding;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.td.plra.persistence.enums.ActiveStatus;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("CategoryBinding predicate builder")
class CategoryBindingTest {

    private final CategoryBinding binding = new CategoryBinding();

    @Test
    void shouldDefaultToActiveYesWhenActiveNotProvided() {
        BooleanExpression predicate = binding.buildPredicate(new HashMap<>());
        assertThat(predicate).isNotNull();
        assertThat(predicate.toString()).contains(ActiveStatus.Y.name());
    }

    @Test
    void shouldIncludeProductNameFilterWhenProvided() {
        Map<String, String> params = new HashMap<>();
        params.put("productName", "ULOC");
        BooleanExpression predicate = binding.buildPredicate(params);
        assertThat(predicate).isNotNull();
        assertThat(predicate.toString()).contains("product");
    }
}
