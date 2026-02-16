package com.td.plra.application.utils;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class PaginationUtilsTest {

    @Nested @DisplayName("resolvePageable")
    class ResolvePageableTests {
        @Test @DisplayName("Should return Pageable.unpaged() when unpaged=true")
        void unpagedTrue() {
            Map<String, String> params = new HashMap<>();
            params.put("unpaged", "true");
            Pageable result = PaginationUtils.resolvePageable(params, PageRequest.of(0, 20));
            assertThat(result.isUnpaged()).isTrue();
        }

        @Test @DisplayName("Should return Pageable.unpaged() case-insensitive")
        void unpagedTrueCaseInsensitive() {
            Map<String, String> params = new HashMap<>();
            params.put("unpaged", "TRUE");
            Pageable result = PaginationUtils.resolvePageable(params, PageRequest.of(0, 20));
            assertThat(result.isUnpaged()).isTrue();
        }

        @Test @DisplayName("Should return default pageable when unpaged=false")
        void unpagedFalse() {
            Map<String, String> params = new HashMap<>();
            params.put("unpaged", "false");
            Pageable defaultPageable = PageRequest.of(0, 20);
            Pageable result = PaginationUtils.resolvePageable(params, defaultPageable);
            assertThat(result).isEqualTo(defaultPageable);
        }

        @Test @DisplayName("Should return default pageable when unpaged not present")
        void unpagedMissing() {
            Map<String, String> params = new HashMap<>();
            Pageable defaultPageable = PageRequest.of(0, 20);
            Pageable result = PaginationUtils.resolvePageable(params, defaultPageable);
            assertThat(result).isEqualTo(defaultPageable);
        }
    }

    @Nested @DisplayName("isUnpaged")
    class IsUnpagedTests {
        @Test @DisplayName("Should return true when unpaged=true")
        void isUnpagedTrue() {
            Map<String, String> params = new HashMap<>();
            params.put("unpaged", "true");
            assertThat(PaginationUtils.isUnpaged(params)).isTrue();
        }

        @Test @DisplayName("Should return false when unpaged=false")
        void isUnpagedFalse() {
            Map<String, String> params = new HashMap<>();
            params.put("unpaged", "false");
            assertThat(PaginationUtils.isUnpaged(params)).isFalse();
        }

        @Test @DisplayName("Should return false when unpaged is missing")
        void isUnpagedMissing() {
            assertThat(PaginationUtils.isUnpaged(new HashMap<>())).isFalse();
        }
    }
}
