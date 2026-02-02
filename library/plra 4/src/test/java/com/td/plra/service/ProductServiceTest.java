package com.td.plra.service;

import com.td.plra.application.exception.BadRequestException;
import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.common.BaseServiceTest;
import com.td.plra.common.TestEntityFactory;
import com.td.plra.persistence.entity.Product;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.repository.ProductRepository;
import com.td.plra.service.product.ProductService;
import com.td.plra.service.product.binding.ProductBinding;
import com.td.plra.service.product.dto.ProductAdminView;
import com.td.plra.service.product.dto.ProductInput;
import com.td.plra.service.product.mapper.ProductMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@DisplayName("ProductService Tests")
class ProductServiceTest extends BaseServiceTest {
    
    @Mock
    private ProductRepository repository;
    
    @Mock
    private ProductMapper mapper;
    
    @Mock
    private ProductBinding binding;
    
    @InjectMocks
    private ProductService service;
    
    private Product product;
    private ProductInput input;
    private ProductAdminView adminView;
    
    @BeforeEach
    void setUp() {
        product = TestEntityFactory.createProduct();
        input = TestEntityFactory.createProductInput();
        adminView = TestEntityFactory.createProductAdminView();
    }
    
    @Nested
    @DisplayName("Create Product")
    class CreateProduct {
        
        @Test
        @DisplayName("Should create product successfully")
        void shouldCreateProductSuccessfully() {
            // Given
            when(repository.existsByName(input.getName())).thenReturn(false);
            when(mapper.toEntity(input)).thenReturn(product);
            when(repository.save(any(Product.class))).thenReturn(product);
            when(mapper.toAdminView(product)).thenReturn(adminView);
            
            // When
            ProductAdminView result = service.create(input);
            
            // Then
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(TEST_ID);
            verify(repository).save(any(Product.class));
        }
        
        @Test
        @DisplayName("Should throw exception when name already exists")
        void shouldThrowExceptionWhenNameExists() {
            // Given
            when(repository.existsByName(input.getName())).thenReturn(true);
            
            // When/Then
            assertThatThrownBy(() -> service.create(input))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("name already exists");
            
            verify(repository, never()).save(any());
        }
    }
    
    @Nested
    @DisplayName("Find Product By ID")
    class FindById {
        
        @Test
        @DisplayName("Should find product by ID successfully")
        void shouldFindProductByIdSuccessfully() {
            // Given
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(product));
            when(mapper.toAdminView(product)).thenReturn(adminView);
            
            // When
            ProductAdminView result = service.findById(TEST_ID);
            
            // Then
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(TEST_ID);
        }
        
        @Test
        @DisplayName("Should throw exception when product not found")
        void shouldThrowExceptionWhenNotFound() {
            // Given
            when(repository.findById(TEST_ID)).thenReturn(Optional.empty());
            
            // When/Then
            assertThatThrownBy(() -> service.findById(TEST_ID))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }
    
    @Nested
    @DisplayName("Find All Products")
    class FindAll {
        
        @Test
        @DisplayName("Should find all products with pagination")
        void shouldFindAllProductsWithPagination() {
            // Given
            Page<Product> page = new PageImpl<>(List.of(product), defaultPageable, 1);
            when(binding.buildPredicate(emptyParams)).thenReturn(null);
            when(repository.findAll(defaultPageable)).thenReturn(page);
            when(mapper.toAdminViewList(anyList())).thenReturn(List.of(adminView));
            
            // When
            PageResponse<ProductAdminView> result = service.findAll(emptyParams, defaultPageable);
            
            // Then
            assertThat(result).isNotNull();
            assertThat(result.getContent()).hasSize(1);
            assertThat(result.getTotalElements()).isEqualTo(1);
        }
    }
    
    @Nested
    @DisplayName("Update Product")
    class UpdateProduct {
        
        @Test
        @DisplayName("Should update product successfully")
        void shouldUpdateProductSuccessfully() {
            // Given
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(product));
            when(repository.existsByName(input.getName())).thenReturn(false);
            when(repository.save(any(Product.class))).thenReturn(product);
            when(mapper.toAdminView(product)).thenReturn(adminView);
            
            // When
            ProductAdminView result = service.update(TEST_ID, input);
            
            // Then
            assertThat(result).isNotNull();
            verify(mapper).updateEntity(input, product);
            verify(repository).save(product);
        }
        
        @Test
        @DisplayName("Should throw exception when updating to existing name")
        void shouldThrowExceptionWhenUpdatingToExistingName() {
            // Given
            ProductInput newInput = ProductInput.builder()
                    .name("Different Name")
                    .type("TYPE")
                    .build();
            
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(product));
            when(repository.existsByName("Different Name")).thenReturn(true);
            
            // When/Then
            assertThatThrownBy(() -> service.update(TEST_ID, newInput))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("name already exists");
        }
    }
    
    @Nested
    @DisplayName("Delete Product")
    class DeleteProduct {
        
        @Test
        @DisplayName("Should soft delete product successfully")
        void shouldSoftDeleteProductSuccessfully() {
            // Given
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(product));
            when(repository.save(any(Product.class))).thenReturn(product);
            
            // When
            service.delete(TEST_ID);
            
            // Then
            assertThat(product.getActive()).isEqualTo(ActiveStatus.N);
            verify(repository).save(product);
        }
        
        @Test
        @DisplayName("Should throw exception when product not found")
        void shouldThrowExceptionWhenProductNotFound() {
            // Given
            when(repository.findById(TEST_ID)).thenReturn(Optional.empty());
            
            // When/Then
            assertThatThrownBy(() -> service.delete(TEST_ID))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }
    
    @Nested
    @DisplayName("Reactivate Product")
    class ReactivateProduct {
        
        @Test
        @DisplayName("Should reactivate product successfully")
        void shouldReactivateProductSuccessfully() {
            // Given
            product.setActive(ActiveStatus.N);
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(product));
            when(repository.save(any(Product.class))).thenReturn(product);
            when(mapper.toAdminView(product)).thenReturn(adminView);
            
            // When
            ProductAdminView result = service.reactivate(TEST_ID);
            
            // Then
            assertThat(product.getActive()).isEqualTo(ActiveStatus.Y);
            verify(repository).save(product);
        }
    }
    
    @Nested
    @DisplayName("Utility Methods")
    class UtilityMethods {
        
        @Test
        @DisplayName("Should check if product exists by ID")
        void shouldCheckIfProductExistsById() {
            // Given
            when(repository.existsById(TEST_ID)).thenReturn(true);
            
            // When
            boolean result = service.existsById(TEST_ID);
            
            // Then
            assertThat(result).isTrue();
        }
        
        @Test
        @DisplayName("Should get entity by ID")
        void shouldGetEntityById() {
            // Given
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(product));
            
            // When
            Product result = service.getEntityById(TEST_ID);
            
            // Then
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(TEST_ID);
        }
    }
}
