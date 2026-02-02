package com.td.plra.resource;

import com.td.plra.service.rateiloc.RateIlocService;
import com.td.plra.service.rateiloc.dto.RateIlocAdminView;
import com.td.plra.testsupport.JsonFixtures;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RateIlocResource.class)
class RateIlocResourceTest {

    @Autowired private MockMvc mockMvc;

    @MockBean private RateIlocService rateIlocService;

    @Test
    void createDraft_returns201_withApiResponseEnvelope() throws Exception {
        when(rateIlocService.createDraft(any()))
                .thenReturn(RateIlocAdminView.builder()
                        .id(10L)
                        .startDate(LocalDate.of(2026, 2, 2))
                        .expiryDate(LocalDate.of(2026, 3, 3))
                        .build());

        String body = JsonFixtures.readAsString("fixtures/rate-iloc-input.json");

        mockMvc.perform(post("/api/rates/iloc/draft")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(10))
                .andExpect(jsonPath("$.data.startDate").value("2026-02-02"))
                .andExpect(jsonPath("$.data.expiryDate").value("2026-03-03"));
    }
}
