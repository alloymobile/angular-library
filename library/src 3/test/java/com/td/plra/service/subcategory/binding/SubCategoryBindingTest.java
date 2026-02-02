package com.td.plra.service.subcategory.binding;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.td.plra.persistence.enums.ActiveStatus;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("SubCategoryBinding predicate builder")
class SubCategoryBindingTest {

    private final SubCategoryBinding binding = new SubCategoryBinding();

    @Test
    void shouldDefaultToActiveYesWhenActiveNotProvided() {
        BooleanExpression predicate = binding.buildPredicate(new HashMap<>());
        assertThat(predicate).isNotNull();
        assertThat(predicate.toString()).contains(ActiveStatus.Y.name());
    }

    @Test
    void shouldIncludeCategoryNameWhenProvided() {
        Map<String, String> params = new HashMap<>();
        params.put("categoryName", "Retail");
        BooleanExpression predicate = binding.buildPredicate(params);
        assertThat(predicate).isNotNull();
        assertThat(predicate.toString()).contains("category");
    }
}
