package com.td.plra.testsupport;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.io.InputStream;

public final class JsonFixtures {

    private static final ObjectMapper MAPPER = new ObjectMapper().registerModule(new JavaTimeModule());

    private JsonFixtures() {}

    public static String readAsString(String classpathLocation) {
        try (InputStream is = JsonFixtures.class.getClassLoader().getResourceAsStream(classpathLocation)) {
            if (is == null) {
                throw new IllegalArgumentException("Fixture not found on classpath: " + classpathLocation);
            }
            return new String(is.readAllBytes());
        } catch (Exception e) {
            throw new RuntimeException("Failed to read fixture: " + classpathLocation, e);
        }
    }

    public static <T> T read(String classpathLocation, Class<T> clazz) {
        try (InputStream is = JsonFixtures.class.getClassLoader().getResourceAsStream(classpathLocation)) {
            if (is == null) {
                throw new IllegalArgumentException("Fixture not found on classpath: " + classpathLocation);
            }
            return MAPPER.readValue(is, clazz);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse fixture: " + classpathLocation, e);
        }
    }
}
