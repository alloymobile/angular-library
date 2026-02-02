package com.td.plra.resource;

import com.td.plra.application.utils.PageResponse;
import com.td.plra.common.BaseResourceTest;
import com.td.plra.common.TestEntityFactory;
import com.td.plra.service.amounttier.AmountTierService;
import com.td.plra.service.amounttier.dto.AmountTierAdminView;
import com.td.plra.service.amounttier.dto.AmountTierInput;
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

@WebMvcTest(AmountTierResource.class)
@DisplayName("AmountTierResource Tests")
class AmountTierResourceTest extends BaseResourceTest {
    
    private static final String BASE_URL = "/api/v1/amount-tiers";
    
    @MockBean
    private AmountTierService service;
    
    private AmountTierInput input;
    private AmountTierAdminView adminView;
    
    @BeforeEach
    void setUp() {
        input = TestEntityFactory.createAmountTierInput();
        adminView = TestEntityFactory.createAmountTierAdminView();
    }
    
    @Nested
    @DisplayName("POST /api/v1/amount-tiers")
    class CreateAmountTier {
        
        @Test
        @DisplayName("Should create amount tier successfully")
        void shouldCreateAmountTierSuccessfully() throws Exception {
            when(service.create(any(AmountTierInput.class))).thenReturn(adminView);
            
            performPost(BASE_URL, input)
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.id", is(1)));
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/amount-tiers/{id}")
    class GetAmountTierById {
        
        @Test
        @DisplayName("Should get amount tier by ID")
        void shouldGetAmountTierById() throws Exception {
            when(service.findById(TEST_ID)).thenReturn(adminView);
            
            performGet(BASE_URL + "/" + TEST_ID)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.id", is(1)));
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/amount-tiers")
    class GetAllAmountTiers {
        
        @Test
        @DisplayName("Should get all amount tiers with pagination")
        void shouldGetAllAmountTiersWithPagination() throws Exception {
            PageResponse<AmountTierAdminView> pageResponse = PageResponse.<AmountTierAdminView>builder()
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
    @DisplayName("PUT /api/v1/amount-tiers/{id}")
    class UpdateAmountTier {
        
        @Test
        @DisplayName("Should update amount tier successfully")
        void shouldUpdateAmountTierSuccessfully() throws Exception {
            when(service.update(anyLong(), any(AmountTierInput.class))).thenReturn(adminView);
            
            performPut(BASE_URL + "/" + TEST_ID, input)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)));
        }
    }
    
    @Nested
    @DisplayName("DELETE /api/v1/amount-tiers/{id}")
    class DeleteAmountTier {
        
        @Test
        @DisplayName("Should delete amount tier successfully")
        void shouldDeleteAmountTierSuccessfully() throws Exception {
            doNothing().when(service).delete(TEST_ID);
            
            performDelete(BASE_URL + "/" + TEST_ID)
                    .andExpect(status().isNoContent());
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/amount-tiers/by-product/{productId}")
    class GetByProduct {
        
        @Test
        @DisplayName("Should get amount tiers by product ID")
        void shouldGetAmountTiersByProductId() throws Exception {
            when(service.findByProductId(TEST_ID)).thenReturn(List.of(adminView));
            
            performGet(BASE_URL + "/by-product/" + TEST_ID)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data", hasSize(1)));
        }
    }
    
    @Nested
    @DisplayName("PATCH /api/v1/amount-tiers/{id}/reactivate")
    class ReactivateAmountTier {
        
        @Test
        @DisplayName("Should reactivate amount tier successfully")
        void shouldReactivateAmountTierSuccessfully() throws Exception {
            when(service.reactivate(TEST_ID)).thenReturn(adminView);
            
            performPatch(BASE_URL + "/" + TEST_ID + "/reactivate")
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)));
        }
    }
}
