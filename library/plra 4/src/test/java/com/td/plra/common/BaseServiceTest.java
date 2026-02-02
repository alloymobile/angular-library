package com.td.plra.common;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.HashMap;
import java.util.Map;

/**
 * Base class for service unit tests.
 * Provides common test utilities and configuration.
 */
@ExtendWith(MockitoExtension.class)
public abstract class BaseServiceTest {
    
    protected static final Long TEST_ID = 1L;
    protected static final String TEST_USER = "test-user";
    
    protected Pageable defaultPageable = PageRequest.of(0, 20, Sort.by(Sort.Direction.DESC, "createdOn"));
    protected Map<String, String> emptyParams = new HashMap<>();
    
    protected Map<String, String> createParams(String... keyValues) {
        Map<String, String> params = new HashMap<>();
        for (int i = 0; i < keyValues.length; i += 2) {
            if (i + 1 < keyValues.length) {
                params.put(keyValues[i], keyValues[i + 1]);
            }
        }
        return params;
    }
}
