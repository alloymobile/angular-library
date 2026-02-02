package com.td.plra.common;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStream;

/**
 * Utility class to load test data from JSON files.
 */
public final class TestDataLoader {
    
    private static final ObjectMapper objectMapper;
    private static JsonNode testData;
    
    static {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        loadTestData();
    }
    
    private TestDataLoader() {
        // Utility class
    }
    
    private static void loadTestData() {
        try {
            ClassPathResource resource = new ClassPathResource("testdata/test-data.json");
            try (InputStream is = resource.getInputStream()) {
                testData = objectMapper.readTree(is);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to load test data", e);
        }
    }
    
    public static JsonNode getTestData() {
        return testData;
    }
    
    public static JsonNode getProducts() {
        return testData.get("products");
    }
    
    public static JsonNode getCategories() {
        return testData.get("categories");
    }
    
    public static JsonNode getSubCategories() {
        return testData.get("subCategories");
    }
    
    public static JsonNode getAmountTiers() {
        return testData.get("amountTiers");
    }
    
    public static JsonNode getCvpCodes() {
        return testData.get("cvpCodes");
    }
    
    public static JsonNode getPrimes() {
        return testData.get("primes");
    }
    
    public static JsonNode getRateIlocDrafts() {
        return testData.get("rateIlocDrafts");
    }
    
    public static JsonNode getRateIlocActives() {
        return testData.get("rateIlocActives");
    }
    
    public static JsonNode getRateUlocDrafts() {
        return testData.get("rateUlocDrafts");
    }
    
    public static JsonNode getWorkflows() {
        return testData.get("workflows");
    }
    
    public static JsonNode getNotifications() {
        return testData.get("notifications");
    }
    
    public static <T> T convertValue(JsonNode node, Class<T> clazz) {
        return objectMapper.convertValue(node, clazz);
    }
    
    public static ObjectMapper getObjectMapper() {
        return objectMapper;
    }
}
