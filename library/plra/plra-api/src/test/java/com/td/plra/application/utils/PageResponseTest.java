package com.td.plra.application.utils;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class PageResponseTest {

    @Test @DisplayName("Should build from Page with mapped content")
    void fromPageWithMappedContent() {
        Page<String> page = new PageImpl<>(List.of("A", "B"), PageRequest.of(0, 10), 2);
        List<Integer> mapped = List.of(1, 2);

        PageResponse<Integer> response = PageResponse.from(page, mapped);

        assertThat(response.getContent()).containsExactly(1, 2);
        assertThat(response.getPage()).isEqualTo(0);
        assertThat(response.getSize()).isEqualTo(10);
        assertThat(response.getTotalElements()).isEqualTo(2);
        assertThat(response.getTotalPages()).isEqualTo(1);
        assertThat(response.isFirst()).isTrue();
        assertThat(response.isLast()).isTrue();
        assertThat(response.isEmpty()).isFalse();
    }

    @Test @DisplayName("Should build from Page directly")
    void fromPageDirect() {
        Page<String> page = new PageImpl<>(List.of("X"), PageRequest.of(0, 5), 1);
        PageResponse<String> response = PageResponse.from(page);
        assertThat(response.getContent()).containsExactly("X");
        assertThat(response.getTotalElements()).isEqualTo(1);
    }

    @Test @DisplayName("Should handle empty page")
    void emptyPage() {
        Page<String> page = new PageImpl<>(List.of(), PageRequest.of(0, 20), 0);
        PageResponse<String> response = PageResponse.from(page, List.of());
        assertThat(response.isEmpty()).isTrue();
        assertThat(response.getTotalElements()).isEqualTo(0);
    }
}
