package com.td.plra.service;

import com.td.plra.application.exception.BadRequestException;
import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.common.BaseServiceTest;
import com.td.plra.common.TestFixtures;
import com.td.plra.persistence.entity.AmountTier;
import com.td.plra.persistence.entity.Product;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.repository.AmountTierRepository;
import com.td.plra.service.amounttier.AmountTierService;
import com.td.plra.service.amounttier.binding.AmountTierBinding;
import com.td.plra.service.amounttier.dto.AmountTierAdminView;
import com.td.plra.service.amounttier.dto.AmountTierInput;
import com.td.plra.service.amounttier.mapper.AmountTierMapper;
import com.td.plra.service.product.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@DisplayName("AmountTierService Tests")
class AmountTierServiceTest extends BaseServiceTest {
    
    @Mock
    private AmountTierRepository repository;
    
    @Mock
    private AmountTierMapper mapper;
    
    @Mock
    private AmountTierBinding binding;
    
    @Mock
    private ProductService productService;
    
    @InjectMocks
    private AmountTierService service;
    
    private AmountTier amountTier;
    private Product product;
    private AmountTierInput input;
    private AmountTierAdminView adminView;
    
    @BeforeEach
    void setUp() {
        product = TestFixtures.createProduct();
        amountTier = TestFixtures.createAmountTier();
        input = TestFixtures.createAmountTierInput();
        adminView = TestFixtures.createAmountTierAdminView();
    }
    
    @Nested
    @DisplayName("Create Amount Tier")
    class CreateAmountTier {
        
        @Test
        @DisplayName("Should create amount tier successfully")
        void shouldCreateAmountTierSuccessfully() {
            // Given
            when(productService.getEntityById(anyLong())).thenReturn(product);
            when(mapper.toEntity(any(AmountTierInput.class))).thenReturn(amountTier);
            when(repository.save(any(AmountTier.class))).thenReturn(amountTier);
            when(mapper.toAdminView(any(AmountTier.class))).thenReturn(adminView);
            
            // When
            AmountTierAdminView result = service.create(input);
            
            // Then
            assertThat(result).isNotNull();
            verify(repository).save(any(AmountTier.class));
        }
        
        @Test
        @DisplayName("Should throw exception when min >= max")
        void shouldThrowExceptionWhenMinGreaterThanMax() {
            // Given
            AmountTierInput invalidInput = AmountTierInput.builder()
                    .name("Invalid Tier")
                    .min(new BigDecimal("100000"))
                    .max(new BigDecimal("50000"))
                    .productId(1L)
                    .build();
            
            // When/Then
            assertThatThrownBy(() -> service.create(invalidInput))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("Minimum amount must be less than maximum amount");
        }
        
        @Test
        @DisplayName("Should throw exception when product not found")
        void shouldThrowExceptionWhenProductNotFound() {
            // Given
            when(productService.getEntityById(anyLong()))
                    .thenThrow(new EntityNotFoundException("Product", 1L));
            
            // When/Then
            assertThatThrownBy(() -> service.create(input))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }
    
    @Nested
    @DisplayName("Find Amount Tier By ID")
    class FindById {
        
        @Test
        @DisplayName("Should find amount tier by ID successfully")
        void shouldFindAmountTierByIdSuccessfully() {
            // Given
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(amountTier));
            when(mapper.toAdminView(amountTier)).thenReturn(adminView);
            
            // When
            AmountTierAdminView result = service.findById(TEST_ID);
            
            // Then
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(TEST_ID);
        }
        
        @Test
        @DisplayName("Should throw exception when amount tier not found")
        void shouldThrowExceptionWhenNotFound() {
            // Given
            when(repository.findById(INVALID_ID)).thenReturn(Optional.empty());
            
            // When/Then
            assertThatThrownBy(() -> service.findById(INVALID_ID))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }
    
    @Nested
    @DisplayName("Find All Amount Tiers")
    class FindAll {
        
        @Test
        @DisplayName("Should find all amount tiers with pagination")
        void shouldFindAllAmountTiersWithPagination() {
            // Given
            Page<AmountTier> tierPage = new PageImpl<>(List.of(amountTier), defaultPageable, 1);
            when(binding.buildPredicate(any())).thenReturn(null);
            when(repository.findAll(defaultPageable)).thenReturn(tierPage);
            when(mapper.toAdminViewList(anyList())).thenReturn(List.of(adminView));
            
            // When
            PageResponse<AmountTierAdminView> result = service.findAll(emptyParams, defaultPageable);
            
            // Then
            assertThat(result).isNotNull();
            assertThat(result.getContent()).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("Update Amount Tier")
    class UpdateAmountTier {
        
        @Test
        @DisplayName("Should update amount tier successfully")
        void shouldUpdateAmountTierSuccessfully() {
            // Given
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(amountTier));
            when(productService.getEntityById(anyLong())).thenReturn(product);
            when(repository.save(any(AmountTier.class))).thenReturn(amountTier);
            when(mapper.toAdminView(any(AmountTier.class))).thenReturn(adminView);
            
            // When
            AmountTierAdminView result = service.update(TEST_ID, input);
            
            // Then
            assertThat(result).isNotNull();
            verify(repository).save(amountTier);
        }
    }
    
    @Nested
    @DisplayName("Delete Amount Tier")
    class DeleteAmountTier {
        
        @Test
        @DisplayName("Should soft delete amount tier successfully")
        void shouldSoftDeleteAmountTierSuccessfully() {
            // Given
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(amountTier));
            when(repository.save(any(AmountTier.class))).thenReturn(amountTier);
            
            // When
            service.delete(TEST_ID);
            
            // Then
            assertThat(amountTier.getActive()).isEqualTo(ActiveStatus.N);
            verify(repository).save(amountTier);
        }
    }
}
