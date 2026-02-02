package com.td.plra.application.utils;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class BaseBindingTest {

    static class TestBinding extends BaseBinding {
        LocalDate d(String s) { return parseDate(s); }
        LocalDateTime dt(String s) { return parseDateTime(s); }
        Long l(String s) { return parseLong(s); }
        Integer i(String s) { return parseInt(s); }
        Boolean b(String s) { return parseBoolean(s); }
        boolean has(Map<String,String> p, String k) { return hasParam(p,k); }
        String get(Map<String,String> p, String k) { return getParam(p,k); }
    }

    private final TestBinding binding = new TestBinding();

    @Test
    void parseDate_returnsNullOnBlankOrInvalid() {
        assertNull(binding.d(null));
        assertNull(binding.d(" "));
        assertNull(binding.d("not-a-date"));
    }

    @Test
    void parseDate_parsesValidIsoDate() {
        assertEquals(LocalDate.of(2026, 2, 2), binding.d("2026-02-02"));
    }

    @Test
    void parseDateTime_parsesIsoDateTimeOrFallsBackToDateStartOfDay() {
        assertEquals(LocalDateTime.of(2026, 2, 2, 10, 30), binding.dt("2026-02-02T10:30:00"));
        assertEquals(LocalDate.of(2026, 2, 2).atStartOfDay(), binding.dt("2026-02-02"));
        assertNull(binding.dt("bad"));
    }

    @Test
    void parseNumber_helpers_returnNullOnInvalid() {
        assertNull(binding.l(null));
        assertNull(binding.l("x"));
        assertEquals(10L, binding.l("10"));

        assertNull(binding.i(""));
        assertNull(binding.i("x"));
        assertEquals(5, binding.i("5"));
    }

    @Test
    void param_helpers_trimAndValidate() {
        Map<String,String> params = new HashMap<>();
        params.put("k", "  v  ");
        params.put("blank", "   ");

        assertTrue(binding.has(params, "k"));
        assertEquals("v", binding.get(params, "k"));

        assertFalse(binding.has(params, "blank"));
        assertNull(binding.get(params, "blank"));
    }
}
