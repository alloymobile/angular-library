package com.td.plra.application.utils;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

class ApiResponseTest {

    @Test @DisplayName("ok() should return 200 with success=true and data")
    void okResponse() {
        ResponseEntity<ApiResponse<String>> response = ApiResponse.ok("Hello");
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().isSuccess()).isTrue();
        assertThat(response.getBody().getData()).isEqualTo("Hello");
        assertThat(response.getBody().getTimestamp()).isNotNull();
    }

    @Test @DisplayName("created() should return 201 with success=true")
    void createdResponse() {
        ResponseEntity<ApiResponse<String>> response = ApiResponse.created("New");
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody().isSuccess()).isTrue();
        assertThat(response.getBody().getData()).isEqualTo("New");
    }

    @Test @DisplayName("noContent() should return 204 with success=true")
    void noContentResponse() {
        ResponseEntity<ApiResponse<Void>> response = ApiResponse.noContent();
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        assertThat(response.getBody().isSuccess()).isTrue();
    }

    @Test @DisplayName("error() should return specified status with success=false")
    void errorResponse() {
        ResponseEntity<ApiResponse<Object>> response = ApiResponse.error(
                HttpStatus.BAD_REQUEST, "/api/test", null);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody().isSuccess()).isFalse();
        assertThat(response.getBody().getPath()).isEqualTo("/api/test");
    }

    @Test @DisplayName("accepted() should return 202 with data")
    void acceptedResponse() {
        ResponseEntity<ApiResponse<String>> response = ApiResponse.accepted("Queued");
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.ACCEPTED);
        assertThat(response.getBody().getData()).isEqualTo("Queued");
    }
}
