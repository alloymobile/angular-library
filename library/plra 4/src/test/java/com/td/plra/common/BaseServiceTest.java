package com.td.plra.common;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.HashMap;
import java.util.Map;

/**
 * Base class for service layer unit tests.
 * Provides common setup and utilities for testing services with mocked dependencies.
 */
@ExtendWith(MockitoExtension.class)
public abstract class BaseServiceTest {
    
    protected static final Long TEST_ID = 1L;
    protected static final Long INVALID_ID = 999L;
    protected static final String TEST_USER = "test-user";
    
    protected Pageable defaultPageable;
    protected Map<String, String> emptyParams;
    
    @BeforeEach
    void setUpBase() {
        defaultPageable = PageRequest.of(0, 20, Sort.by(Sort.Direction.DESC, "createdOn"));
        emptyParams = new HashMap<>();
    }
    
    protected Map<String, String> paramsWithActive(String active) {
        Map<String, String> params = new HashMap<>();
        params.put("active", active);
        return params;
    }
    
    protected Map<String, String> paramsWithName(String name) {
        Map<String, String> params = new HashMap<>();
        params.put("name", name);
        return params;
    }
    
    protected Map<String, String> paramsWithStatus(String status) {
        Map<String, String> params = new HashMap<>();
        params.put("status", status);
        return params;
    }
}
