package com.td.plra.resource;

import com.td.plra.application.exception.BadRequestException;
import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.exception.GlobalExceptionHandler;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.common.BaseResourceTest;
import com.td.plra.common.TestFixtures;
import com.td.plra.service.amounttier.AmountTierService;
import com.td.plra.service.amounttier.dto.AmountTierAdminView;
import com.td.plra.service.amounttier.dto.AmountTierInput;
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

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AmountTierResource Tests")
class AmountTierResourceTest extends BaseResourceTest {
    
    private static final String BASE_URL = "/api/v1/amount-tiers";
    
    @Mock
    private AmountTierService service;
    
    @InjectMocks
    private AmountTierResource resource;
    
    private AmountTierInput input;
    private AmountTierAdminView adminView;
    
    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(resource)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        
        input = TestFixtures.createAmountTierInput();
        adminView = TestFixtures.createAmountTierAdminView();
    }
    
    @Nested
    @DisplayName("POST /api/v1/amount-tiers")
    class CreateAmountTier {
        
        @Test
        @DisplayName("Should create amount tier and return 201")
        void shouldCreateAmountTierAndReturn201() throws Exception {
            // Given
            when(service.create(any(AmountTierInput.class))).thenReturn(adminView);
            
            // When/Then
            performPost(BASE_URL, input)
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.id").value(adminView.getId()))
                    .andExpect(jsonPath("$.data.name").value(adminView.getName()))
                    .andExpect(jsonPath("$.data.min").value(adminView.getMin().doubleValue()))
                    .andExpect(jsonPath("$.data.max").value(adminView.getMax().doubleValue()));
        }
        
        @Test
        @DisplayName("Should return 400 when min >= max")
        void shouldReturn400WhenMinGreaterThanMax() throws Exception {
            // Given
            AmountTierInput invalidInput = AmountTierInput.builder()
                    .name("Invalid Tier")
                    .min(new BigDecimal("100000"))
                    .max(new BigDecimal("50000"))
                    .productId(1L)
                    .build();
            
            when(service.create(any(AmountTierInput.class)))
                    .thenThrow(new BadRequestException("min", "Minimum amount must be less than maximum amount"));
            
            // When/Then
            performPost(BASE_URL, invalidInput)
                    .andExpect(status().isBadRequest());
        }
        
        @Test
        @DisplayName("Should return 404 when product not found")
        void shouldReturn404WhenProductNotFound() throws Exception {
            // Given
            when(service.create(any(AmountTierInput.class)))
                    .thenThrow(new EntityNotFoundException("Product", 1L));
            
            // When/Then
            performPost(BASE_URL, input)
                    .andExpect(status().isNotFound());
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/amount-tiers/{id}")
    class GetAmountTierById {
        
        @Test
        @DisplayName("Should return amount tier when found")
        void shouldReturnAmountTierWhenFound() throws Exception {
            // Given
            when(service.findById(TEST_ID)).thenReturn(adminView);
            
            // When/Then
            performGet(BASE_URL + "/" + TEST_ID)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.id").value(adminView.getId()))
                    .andExpect(jsonPath("$.data.product").exists());
        }
        
        @Test
        @DisplayName("Should return 404 when not found")
        void shouldReturn404WhenNotFound() throws Exception {
            // Given
            when(service.findById(INVALID_ID))
                    .thenThrow(new EntityNotFoundException("AmountTier", INVALID_ID));
            
            // When/Then
            performGet(BASE_URL + "/" + INVALID_ID)
                    .andExpect(status().isNotFound());
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/amount-tiers")
    class GetAllAmountTiers {
        
        @Test
        @DisplayName("Should return paginated amount tiers")
        void shouldReturnPaginatedAmountTiers() throws Exception {
            // Given
            PageResponse<AmountTierAdminView> pageResponse = PageResponse.from(
                    new PageImpl<>(List.of(adminView)), List.of(adminView));
            
            when(service.findAll(any(Map.class), any(Pageable.class))).thenReturn(pageResponse);
            
            // When/Then
            performGet(BASE_URL)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.content", hasSize(1)));
        }
    }
    
    @Nested
    @DisplayName("PUT /api/v1/amount-tiers/{id}")
    class UpdateAmountTier {
        
        @Test
        @DisplayName("Should update amount tier successfully")
        void shouldUpdateAmountTierSuccessfully() throws Exception {
            // Given
            when(service.update(eq(TEST_ID), any(AmountTierInput.class))).thenReturn(adminView);
            
            // When/Then
            performPut(BASE_URL + "/" + TEST_ID, input)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true));
        }
    }
    
    @Nested
    @DisplayName("DELETE /api/v1/amount-tiers/{id}")
    class DeleteAmountTier {
        
        @Test
        @DisplayName("Should delete amount tier and return 204")
        void shouldDeleteAmountTierAndReturn204() throws Exception {
            // Given
            doNothing().when(service).delete(TEST_ID);
            
            // When/Then
            performDelete(BASE_URL + "/" + TEST_ID)
                    .andExpect(status().isNoContent());
        }
    }
    
    @Nested
    @DisplayName("PATCH /api/v1/amount-tiers/{id}/reactivate")
    class ReactivateAmountTier {
        
        @Test
        @DisplayName("Should reactivate amount tier successfully")
        void shouldReactivateAmountTierSuccessfully() throws Exception {
            // Given
            when(service.reactivate(TEST_ID)).thenReturn(adminView);
            
            // When/Then
            performPatch(BASE_URL + "/" + TEST_ID + "/reactivate")
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.active").value(true));
        }
    }
}
