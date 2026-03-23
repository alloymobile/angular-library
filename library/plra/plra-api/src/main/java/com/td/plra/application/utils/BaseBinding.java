package com.td.plra.application.utils;

import com.querydsl.core.types.dsl.BooleanExpression;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.Map;
import java.util.function.BiFunction;

/**
 * Reusable helpers for children to build QueryDSL predicates from query params.
 */
public abstract class BaseBinding {
    
    /**
     * Parses a date string to LocalDate.
     * Returns null if the string is null, blank, or cannot be parsed.
     */
    protected LocalDate parseDate(String s) {
        if (s == null || s.isBlank()) return null;
        try {
            return LocalDate.parse(s.trim());
        } catch (DateTimeParseException e) {
            return null;
        }
    }
    
    /**
     * Parses a date string to LocalDateTime.
     * Returns null if the string is null, blank, or cannot be parsed.
     */
    protected LocalDateTime parseDateTime(String s) {
        if (s == null || s.isBlank()) return null;
        try {
            return LocalDateTime.parse(s.trim());
        } catch (DateTimeParseException e) {
            // Try parsing as LocalDate and convert to start of day
            try {
                return LocalDate.parse(s.trim()).atStartOfDay();
            } catch (DateTimeParseException ex) {
                return null;
            }
        }
    }
    
    /**
     * Builds a date range predicate from query parameters.
     */
    protected BooleanExpression dateRange(
            Map<String, String> params,
            String fromKey,
            String toKey,
            BiFunction<LocalDateTime, LocalDateTime, BooleanExpression> betweenFactory) {
        
        LocalDate from = parseDate(params.get(fromKey));
        LocalDate to = parseDate(params.get(toKey));
        
        if (from == null && to == null) return null;
        
        LocalDateTime start = (from != null) 
                ? from.atStartOfDay() 
                : LocalDate.MIN.atStartOfDay();
        LocalDateTime end = (to != null) 
                ? to.atTime(23, 59, 59) 
                : LocalDate.MAX.atTime(23, 59, 59);
        
        return betweenFactory.apply(start, end);
    }
    
    /**
     * Compose predicates safely.
     * Returns extra if base is null, base if extra is null, or base.and(extra) if both exist.
     */
    protected BooleanExpression and(BooleanExpression base, BooleanExpression extra) {
        if (base == null) return extra;
        if (extra == null) return base;
        return base.and(extra);
    }
    
    /**
     * Compose predicates with OR logic.
     */
    protected BooleanExpression or(BooleanExpression base, BooleanExpression extra) {
        if (base == null) return extra;
        if (extra == null) return base;
        return base.or(extra);
    }
    
    /**
     * Parse a Long from string, returning null if invalid.
     */
    protected Long parseLong(String s) {
        if (s == null || s.isBlank()) return null;
        try {
            return Long.parseLong(s.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }
    
    /**
     * Parse an Integer from string, returning null if invalid.
     */
    protected Integer parseInt(String s) {
        if (s == null || s.isBlank()) return null;
        try {
            return Integer.parseInt(s.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }
    
    /**
     * Parse a Boolean from string, returning null if invalid.
     */
    protected Boolean parseBoolean(String s) {
        if (s == null || s.isBlank()) return null;
        return Boolean.parseBoolean(s.trim());
    }
    
    /**
     * Check if a param exists and is not blank.
     */
    protected boolean hasParam(Map<String, String> params, String key) {
        return params.containsKey(key) && params.get(key) != null && !params.get(key).isBlank();
    }
    
    /**
     * Get a param value, returning null if not present or blank.
     */
    protected String getParam(Map<String, String> params, String key) {
        if (!hasParam(params, key)) return null;
        return params.get(key).trim();
    }
}
