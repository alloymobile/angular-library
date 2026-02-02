package com.td.plra.application.utils;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("BaseBinding helper methods")
class BaseBindingTest {

    static class TestBinding extends BaseBinding {
        LocalDate parseDatePublic(String s) { return parseDate(s); }
        LocalDateTime parseDateTimePublic(String s) { return parseDateTime(s); }
        Long parseLongPublic(String s) { return parseLong(s); }
        Integer parseIntPublic(String s) { return parseInt(s); }
        Boolean parseBooleanPublic(String s) { return parseBoolean(s); }
        boolean hasParamPublic(Map<String,String> params, String key) { return hasParam(params, key); }
        String getParamPublic(Map<String,String> params, String key) { return getParam(params, key); }
        BooleanExpression andPublic(BooleanExpression a, BooleanExpression b) { return and(a, b); }
        BooleanExpression orPublic(BooleanExpression a, BooleanExpression b) { return or(a, b); }
        BooleanExpression dateRangePublic(Map<String,String> params, String fromKey, String toKey) {
            return dateRange(params, fromKey, toKey,
                    (start, end) -> Expressions.booleanTemplate("between({0},{1})", start, end));
        }
    }

    private final TestBinding binding = new TestBinding();

    @Test
    void parseDate_shouldHandleNullBlankInvalidAndValid() {
        assertThat(binding.parseDatePublic(null)).isNull();
        assertThat(binding.parseDatePublic("")).isNull();
        assertThat(binding.parseDatePublic("  ")).isNull();
        assertThat(binding.parseDatePublic("not-a-date")).isNull();
        assertThat(binding.parseDatePublic("2026-02-02")).isEqualTo(LocalDate.of(2026, 2, 2));
    }

    @Test
    void parseDateTime_shouldParseDateTimeOrFallbackToDateStartOfDay() {
        assertThat(binding.parseDateTimePublic(null)).isNull();
        assertThat(binding.parseDateTimePublic("")).isNull();
        assertThat(binding.parseDateTimePublic("not-a-datetime")).isNull();

        LocalDateTime dt = binding.parseDateTimePublic("2026-02-02T10:15:30");
        assertThat(dt).isEqualTo(LocalDateTime.of(2026, 2, 2, 10, 15, 30));

        LocalDateTime fallback = binding.parseDateTimePublic("2026-02-02");
        assertThat(fallback).isEqualTo(LocalDate.of(2026, 2, 2).atStartOfDay());
    }

    @Test
    void parseLongIntBoolean_shouldHandleInvalidAndValid() {
        assertThat(binding.parseLongPublic(null)).isNull();
        assertThat(binding.parseLongPublic("x")).isNull();
        assertThat(binding.parseLongPublic(" 123 ")).isEqualTo(123L);

        assertThat(binding.parseIntPublic("y")).isNull();
        assertThat(binding.parseIntPublic(" 7 ")).isEqualTo(7);

        assertThat(binding.parseBooleanPublic(null)).isNull();
        assertThat(binding.parseBooleanPublic("")).isNull();
        assertThat(binding.parseBooleanPublic("true")).isTrue();
        assertThat(binding.parseBooleanPublic("FALSE")).isFalse();
    }

    @Test
    void hasParam_and_getParam_shouldWork() {
        Map<String, String> params = new HashMap<>();
        params.put("a", "  x  ");
        params.put("b", "  ");
        params.put("c", null);

        assertThat(binding.hasParamPublic(params, "a")).isTrue();
        assertThat(binding.getParamPublic(params, "a")).isEqualTo("x");
        assertThat(binding.hasParamPublic(params, "b")).isFalse();
        assertThat(binding.getParamPublic(params, "b")).isNull();
        assertThat(binding.hasParamPublic(params, "c")).isFalse();
        assertThat(binding.getParamPublic(params, "c")).isNull();
        assertThat(binding.hasParamPublic(params, "missing")).isFalse();
    }

    @Test
    void and_or_shouldComposeNullSafely() {
        BooleanExpression p1 = Expressions.booleanTemplate("p1");
        BooleanExpression p2 = Expressions.booleanTemplate("p2");

        assertThat(binding.andPublic(null, p1)).isEqualTo(p1);
        assertThat(binding.andPublic(p1, null)).isEqualTo(p1);
        assertThat(binding.andPublic(p1, p2).toString()).contains("p1").contains("p2");

        assertThat(binding.orPublic(null, p1)).isEqualTo(p1);
        assertThat(binding.orPublic(p1, null)).isEqualTo(p1);
        assertThat(binding.orPublic(p1, p2).toString()).contains("p1").contains("p2");
    }

    @Test
    void dateRange_shouldCreateStartAndEndBounds() {
        Map<String, String> params = new HashMap<>();
        params.put("from", "2026-02-01");
        params.put("to", "2026-02-02");

        BooleanExpression expr = binding.dateRangePublic(params, "from", "to");
        assertThat(expr).isNotNull();
        assertThat(expr.toString())
                .contains("2026-02-01T00:00")
                .contains("2026-02-02T23:59:59");
    }

    @Test
    void dateRange_shouldHandleOpenEndedRanges() {
        Map<String, String> params = new HashMap<>();
        params.put("from", "2026-02-01");

        BooleanExpression expr = binding.dateRangePublic(params, "from", "to");
        assertThat(expr).isNotNull();
        assertThat(expr.toString()).contains("2026-02-01T00:00");
    }
}
