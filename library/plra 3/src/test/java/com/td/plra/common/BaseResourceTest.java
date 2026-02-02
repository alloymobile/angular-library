package com.td.plra.common;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

/**
 * Base class for Resource/Controller layer integration tests.
 * Provides common utilities for testing REST endpoints.
 */
public abstract class BaseResourceTest {
    
    protected MockMvc mockMvc;
    
    protected ObjectMapper objectMapper;
    
    protected static final Long TEST_ID = 1L;
    protected static final Long INVALID_ID = 999L;
    protected static final String APPLICATION_JSON = MediaType.APPLICATION_JSON_VALUE;
    
    @BeforeEach
    void setUpBase() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }
    
    protected String toJson(Object object) throws Exception {
        return objectMapper.writeValueAsString(object);
    }
    
    protected ResultActions performGet(String url) throws Exception {
        return mockMvc.perform(get(url)
                .contentType(APPLICATION_JSON));
    }
    
    protected ResultActions performGet(String url, String paramName, String paramValue) throws Exception {
        return mockMvc.perform(get(url)
                .param(paramName, paramValue)
                .contentType(APPLICATION_JSON));
    }
    
    protected ResultActions performPost(String url, Object body) throws Exception {
        return mockMvc.perform(post(url)
                .contentType(APPLICATION_JSON)
                .content(toJson(body)));
    }
    
    protected ResultActions performPut(String url, Object body) throws Exception {
        return mockMvc.perform(put(url)
                .contentType(APPLICATION_JSON)
                .content(toJson(body)));
    }
    
    protected ResultActions performPatch(String url, Object body) throws Exception {
        return mockMvc.perform(patch(url)
                .contentType(APPLICATION_JSON)
                .content(toJson(body)));
    }
    
    protected ResultActions performPatch(String url) throws Exception {
        return mockMvc.perform(patch(url)
                .contentType(APPLICATION_JSON));
    }
    
    protected ResultActions performDelete(String url) throws Exception {
        return mockMvc.perform(delete(url)
                .contentType(APPLICATION_JSON));
    }
}
