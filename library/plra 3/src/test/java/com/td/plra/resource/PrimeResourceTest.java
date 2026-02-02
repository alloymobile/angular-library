package com.td.plra.resource;

import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.exception.GlobalExceptionHandler;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.common.BaseResourceTest;
import com.td.plra.common.TestFixtures;
import com.td.plra.service.prime.PrimeService;
import com.td.plra.service.prime.dto.PrimeAdminView;
import com.td.plra.service.prime.dto.PrimeInput;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("PrimeResource Tests")
class PrimeResourceTest extends BaseResourceTest {
    
    private static final String BASE_URL = "/api/v1/primes";
    
    @Mock
    private PrimeService service;
    
    @InjectMocks
    private PrimeResource resource;
    
    private PrimeInput input;
    private PrimeAdminView adminView;
    
    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(resource)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        
        input = TestFixtures.createPrimeInput();
        adminView = TestFixtures.createPrimeAdminView();
    }
    
    @Nested
    @DisplayName("POST /api/v1/primes")
    class CreatePrime {
        
        @Test
        @DisplayName("Should create prime rate and return 201")
        void shouldCreatePrimeRateAndReturn201() throws Exception {
            // Given
            when(service.create(any(PrimeInput.class))).thenReturn(adminView);
            
            // When/Then
            performPost(BASE_URL, input)
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.id").value(adminView.getId()))
                    .andExpect(jsonPath("$.data.rate").value(adminView.getRate().doubleValue()));
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/primes/current")
    class GetCurrentPrime {
        
        @Test
        @DisplayName("Should return current prime rate when exists")
        void shouldReturnCurrentPrimeRateWhenExists() throws Exception {
            // Given
            when(service.getCurrentPrime()).thenReturn(Optional.of(adminView));
            
            // When/Then
            performGet(BASE_URL + "/current")
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.rate").value(adminView.getRate().doubleValue()));
        }
        
        @Test
        @DisplayName("Should return 204 when no current prime rate")
        void shouldReturn204WhenNoCurrentPrimeRate() throws Exception {
            // Given
            when(service.getCurrentPrime()).thenReturn(Optional.empty());
            
            // When/Then
            performGet(BASE_URL + "/current")
                    .andExpect(status().isNoContent());
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/primes/{id}")
    class GetPrimeById {
        
        @Test
        @DisplayName("Should return prime rate when found")
        void shouldReturnPrimeRateWhenFound() throws Exception {
            // Given
            when(service.findById(TEST_ID)).thenReturn(adminView);
            
            // When/Then
            performGet(BASE_URL + "/" + TEST_ID)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.id").value(adminView.getId()));
        }
        
        @Test
        @DisplayName("Should return 404 when not found")
        void shouldReturn404WhenNotFound() throws Exception {
            // Given
            when(service.findById(INVALID_ID))
                    .thenThrow(new EntityNotFoundException("Prime", INVALID_ID));
            
            // When/Then
            performGet(BASE_URL + "/" + INVALID_ID)
                    .andExpect(status().isNotFound());
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/primes")
    class GetAllPrimes {
        
        @Test
        @DisplayName("Should return paginated prime rates")
        void shouldReturnPaginatedPrimeRates() throws Exception {
            // Given
            PageResponse<PrimeAdminView> pageResponse = PageResponse.from(
                    new PageImpl<>(List.of(adminView)), List.of(adminView));
            
            when(service.findAll(any(Map.class), any(Pageable.class))).thenReturn(pageResponse);
            
            // When/Then
            performGet(BASE_URL)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.content", hasSize(1)));
        }
    }
    
    @Nested
    @DisplayName("PUT /api/v1/primes/{id}")
    class UpdatePrime {
        
        @Test
        @DisplayName("Should update prime rate successfully")
        void shouldUpdatePrimeRateSuccessfully() throws Exception {
            // Given
            when(service.update(eq(TEST_ID), any(PrimeInput.class))).thenReturn(adminView);
            
            // When/Then
            performPut(BASE_URL + "/" + TEST_ID, input)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true));
        }
    }
    
    @Nested
    @DisplayName("DELETE /api/v1/primes/{id}")
    class DeletePrime {
        
        @Test
        @DisplayName("Should delete prime rate and return 204")
        void shouldDeletePrimeRateAndReturn204() throws Exception {
            // Given
            doNothing().when(service).delete(TEST_ID);
            
            // When/Then
            performDelete(BASE_URL + "/" + TEST_ID)
                    .andExpect(status().isNoContent());
        }
    }
    
    @Nested
    @DisplayName("PATCH /api/v1/primes/{id}/reactivate")
    class ReactivatePrime {
        
        @Test
        @DisplayName("Should reactivate prime rate successfully")
        void shouldReactivatePrimeRateSuccessfully() throws Exception {
            // Given
            when(service.reactivate(TEST_ID)).thenReturn(adminView);
            
            // When/Then
            performPatch(BASE_URL + "/" + TEST_ID + "/reactivate")
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.active").value(true));
        }
    }
}
