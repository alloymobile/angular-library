package com.td.plra.resource;

import com.td.plra.application.utils.PageResponse;
import com.td.plra.common.BaseResourceTest;
import com.td.plra.common.TestEntityFactory;
import com.td.plra.service.prime.PrimeService;
import com.td.plra.service.prime.dto.PrimeAdminView;
import com.td.plra.service.prime.dto.PrimeInput;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PrimeResource.class)
@DisplayName("PrimeResource Tests")
class PrimeResourceTest extends BaseResourceTest {
    
    private static final String BASE_URL = "/api/v1/primes";
    
    @MockBean
    private PrimeService service;
    
    private PrimeInput input;
    private PrimeAdminView adminView;
    
    @BeforeEach
    void setUp() {
        input = TestEntityFactory.createPrimeInput();
        adminView = TestEntityFactory.createPrimeAdminView();
    }
    
    @Nested
    @DisplayName("POST /api/v1/primes")
    class CreatePrime {
        
        @Test
        @DisplayName("Should create prime rate successfully")
        void shouldCreatePrimeRateSuccessfully() throws Exception {
            when(service.create(any(PrimeInput.class))).thenReturn(adminView);
            
            performPost(BASE_URL, input)
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.id", is(1)));
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/primes/{id}")
    class GetPrimeById {
        
        @Test
        @DisplayName("Should get prime rate by ID")
        void shouldGetPrimeRateById() throws Exception {
            when(service.findById(TEST_ID)).thenReturn(adminView);
            
            performGet(BASE_URL + "/" + TEST_ID)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.id", is(1)));
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/primes")
    class GetAllPrimes {
        
        @Test
        @DisplayName("Should get all prime rates with pagination")
        void shouldGetAllPrimeRatesWithPagination() throws Exception {
            PageResponse<PrimeAdminView> pageResponse = PageResponse.<PrimeAdminView>builder()
                    .content(List.of(adminView))
                    .pageNumber(0)
                    .pageSize(20)
                    .totalElements(1)
                    .totalPages(1)
                    .first(true)
                    .last(true)
                    .build();
            
            when(service.findAll(any(Map.class), any(Pageable.class))).thenReturn(pageResponse);
            
            performGet(BASE_URL)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.content", hasSize(1)));
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/primes/current")
    class GetCurrentPrime {
        
        @Test
        @DisplayName("Should get current prime rate")
        void shouldGetCurrentPrimeRate() throws Exception {
            when(service.findCurrentPrime()).thenReturn(adminView);
            
            performGet(BASE_URL + "/current")
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.id", is(1)));
        }
    }
    
    @Nested
    @DisplayName("PUT /api/v1/primes/{id}")
    class UpdatePrime {
        
        @Test
        @DisplayName("Should update prime rate successfully")
        void shouldUpdatePrimeRateSuccessfully() throws Exception {
            when(service.update(anyLong(), any(PrimeInput.class))).thenReturn(adminView);
            
            performPut(BASE_URL + "/" + TEST_ID, input)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)));
        }
    }
    
    @Nested
    @DisplayName("DELETE /api/v1/primes/{id}")
    class DeletePrime {
        
        @Test
        @DisplayName("Should delete prime rate successfully")
        void shouldDeletePrimeRateSuccessfully() throws Exception {
            doNothing().when(service).delete(TEST_ID);
            
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
            when(service.reactivate(TEST_ID)).thenReturn(adminView);
            
            performPatch(BASE_URL + "/" + TEST_ID + "/reactivate")
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)));
        }
    }
}
