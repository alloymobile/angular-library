package com.td.plra.common;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

/**
 * Base class for REST controller tests.
 * Provides common test utilities and MockMvc configuration.
 */
@AutoConfigureMockMvc
public abstract class BaseResourceTest {
    
    @Autowired
    protected MockMvc mockMvc;
    
    protected static final ObjectMapper objectMapper;
    
    static {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }
    
    protected static final Long TEST_ID = 1L;
    protected static final String TEST_USER = "test-user";
    
    protected String toJson(Object obj) throws Exception {
        return objectMapper.writeValueAsString(obj);
    }
    
    protected ResultActions performGet(String url) throws Exception {
        return mockMvc.perform(get(url)
                .contentType(MediaType.APPLICATION_JSON));
    }
    
    protected ResultActions performPost(String url, Object body) throws Exception {
        return mockMvc.perform(post(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(body)));
    }
    
    protected ResultActions performPut(String url, Object body) throws Exception {
        return mockMvc.perform(put(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(body)));
    }
    
    protected ResultActions performPatch(String url) throws Exception {
        return mockMvc.perform(patch(url)
                .contentType(MediaType.APPLICATION_JSON));
    }
    
    protected ResultActions performPatch(String url, Object body) throws Exception {
        return mockMvc.perform(patch(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(body)));
    }
    
    protected ResultActions performDelete(String url) throws Exception {
        return mockMvc.perform(delete(url)
                .contentType(MediaType.APPLICATION_JSON));
    }
}
