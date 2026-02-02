package com.td.plra.service;

import com.td.plra.application.exception.BadRequestException;
import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.common.BaseServiceTest;
import com.td.plra.common.TestEntityFactory;
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
import static org.mockito.ArgumentMatchers.anyList;
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
        product = TestEntityFactory.createProduct();
        amountTier = TestEntityFactory.createAmountTier();
        input = TestEntityFactory.createAmountTierInput();
        adminView = TestEntityFactory.createAmountTierAdminView();
    }
    
    @Nested
    @DisplayName("Create AmountTier")
    class CreateAmountTier {
        
        @Test
        @DisplayName("Should create amount tier successfully")
        void shouldCreateAmountTierSuccessfully() {
            // Given
            when(productService.getEntityById(anyLong())).thenReturn(product);
            when(repository.findByNameAndProduct(input.getName(), product)).thenReturn(Optional.empty());
            when(mapper.toEntity(input)).thenReturn(amountTier);
            when(repository.save(any(AmountTier.class))).thenReturn(amountTier);
            when(mapper.toAdminView(amountTier)).thenReturn(adminView);
            
            // When
            AmountTierAdminView result = service.create(input);
            
            // Then
            assertThat(result).isNotNull();
            verify(repository).save(any(AmountTier.class));
        }
        
        @Test
        @DisplayName("Should throw exception when name already exists for product")
        void shouldThrowExceptionWhenNameExistsForProduct() {
            // Given
            when(productService.getEntityById(anyLong())).thenReturn(product);
            when(repository.findByNameAndProduct(input.getName(), product)).thenReturn(Optional.of(amountTier));
            
            // When/Then
            assertThatThrownBy(() -> service.create(input))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("already exists");
        }
        
        @Test
        @DisplayName("Should throw exception when min greater than max")
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
                    .hasMessageContaining("min");
        }
    }
    
    @Nested
    @DisplayName("Find AmountTier By ID")
    class FindById {
        
        @Test
        @DisplayName("Should find amount tier by ID")
        void shouldFindAmountTierById() {
            // Given
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(amountTier));
            when(mapper.toAdminView(amountTier)).thenReturn(adminView);
            
            // When
            AmountTierAdminView result = service.findById(TEST_ID);
            
            // Then
            assertThat(result).isNotNull();
        }
        
        @Test
        @DisplayName("Should throw exception when not found")
        void shouldThrowExceptionWhenNotFound() {
            // Given
            when(repository.findById(TEST_ID)).thenReturn(Optional.empty());
            
            // When/Then
            assertThatThrownBy(() -> service.findById(TEST_ID))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }
    
    @Nested
    @DisplayName("Find All AmountTiers")
    class FindAll {
        
        @Test
        @DisplayName("Should find all amount tiers with pagination")
        void shouldFindAllAmountTiersWithPagination() {
            // Given
            Page<AmountTier> page = new PageImpl<>(List.of(amountTier), defaultPageable, 1);
            when(binding.buildPredicate(emptyParams)).thenReturn(null);
            when(repository.findAll(defaultPageable)).thenReturn(page);
            when(mapper.toAdminViewList(anyList())).thenReturn(List.of(adminView));
            
            // When
            PageResponse<AmountTierAdminView> result = service.findAll(emptyParams, defaultPageable);
            
            // Then
            assertThat(result).isNotNull();
            assertThat(result.getContent()).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("Find By Product")
    class FindByProduct {
        
        @Test
        @DisplayName("Should find amount tiers by product ID")
        void shouldFindAmountTiersByProductId() {
            // Given
            when(productService.getEntityById(TEST_ID)).thenReturn(product);
            when(repository.findByProductAndActive(product, ActiveStatus.Y))
                    .thenReturn(List.of(amountTier));
            when(mapper.toAdminViewList(anyList())).thenReturn(List.of(adminView));
            
            // When
            List<AmountTierAdminView> result = service.findByProductId(TEST_ID);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("Delete AmountTier")
    class DeleteAmountTier {
        
        @Test
        @DisplayName("Should soft delete amount tier")
        void shouldSoftDeleteAmountTier() {
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
