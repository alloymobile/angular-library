package com.td.plra.service;

import com.td.plra.application.exception.BadRequestException;
import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.common.BaseServiceTest;
import com.td.plra.common.TestFixtures;
import com.td.plra.persistence.entity.Category;
import com.td.plra.persistence.entity.Product;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.repository.CategoryRepository;
import com.td.plra.service.category.CategoryService;
import com.td.plra.service.category.binding.CategoryBinding;
import com.td.plra.service.category.dto.CategoryAdminView;
import com.td.plra.service.category.dto.CategoryInput;
import com.td.plra.service.category.mapper.CategoryMapper;
import com.td.plra.service.product.ProductService;
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
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@DisplayName("CategoryService Tests")
class CategoryServiceTest extends BaseServiceTest {
    
    @Mock
    private CategoryRepository repository;
    
    @Mock
    private CategoryMapper mapper;
    
    @Mock
    private CategoryBinding binding;
    
    @Mock
    private ProductService productService;
    
    @InjectMocks
    private CategoryService service;
    
    private Category category;
    private Product product;
    private CategoryInput input;
    private CategoryAdminView adminView;
    
    @BeforeEach
    void setUp() {
        product = TestFixtures.createProduct();
        category = TestFixtures.createCategory();
        input = TestFixtures.createCategoryInput();
        adminView = TestFixtures.createCategoryAdminView();
    }
    
    @Nested
    @DisplayName("Create Category")
    class CreateCategory {
        
        @Test
        @DisplayName("Should create category successfully")
        void shouldCreateCategorySuccessfully() {
            // Given
            when(repository.existsByName(anyString())).thenReturn(false);
            when(productService.getEntityById(anyLong())).thenReturn(product);
            when(mapper.toEntity(any(CategoryInput.class))).thenReturn(category);
            when(repository.save(any(Category.class))).thenReturn(category);
            when(mapper.toAdminView(any(Category.class))).thenReturn(adminView);
            
            // When
            CategoryAdminView result = service.create(input);
            
            // Then
            assertThat(result).isNotNull();
            assertThat(result.getName()).isEqualTo(input.getName());
            verify(productService).getEntityById(input.getProductId());
            verify(repository).save(any(Category.class));
        }
        
        @Test
        @DisplayName("Should throw exception when name already exists")
        void shouldThrowExceptionWhenNameExists() {
            // Given
            when(repository.existsByName(anyString())).thenReturn(true);
            
            // When/Then
            assertThatThrownBy(() -> service.create(input))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("already exists");
            
            verify(repository, never()).save(any(Category.class));
        }
        
        @Test
        @DisplayName("Should throw exception when product not found")
        void shouldThrowExceptionWhenProductNotFound() {
            // Given
            when(repository.existsByName(anyString())).thenReturn(false);
            when(productService.getEntityById(anyLong()))
                    .thenThrow(new EntityNotFoundException("Product", input.getProductId()));
            
            // When/Then
            assertThatThrownBy(() -> service.create(input))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessageContaining("Product");
        }
    }
    
    @Nested
    @DisplayName("Find Category By ID")
    class FindById {
        
        @Test
        @DisplayName("Should find category by ID successfully")
        void shouldFindCategoryByIdSuccessfully() {
            // Given
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(category));
            when(mapper.toAdminView(category)).thenReturn(adminView);
            
            // When
            CategoryAdminView result = service.findById(TEST_ID);
            
            // Then
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(TEST_ID);
        }
        
        @Test
        @DisplayName("Should throw exception when category not found")
        void shouldThrowExceptionWhenNotFound() {
            // Given
            when(repository.findById(INVALID_ID)).thenReturn(Optional.empty());
            
            // When/Then
            assertThatThrownBy(() -> service.findById(INVALID_ID))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessageContaining("Category");
        }
    }
    
    @Nested
    @DisplayName("Find All Categories")
    class FindAll {
        
        @Test
        @DisplayName("Should find all categories with pagination")
        void shouldFindAllCategoriesWithPagination() {
            // Given
            Page<Category> categoryPage = new PageImpl<>(List.of(category), defaultPageable, 1);
            when(binding.buildPredicate(any())).thenReturn(null);
            when(repository.findAll(defaultPageable)).thenReturn(categoryPage);
            when(mapper.toAdminViewList(anyList())).thenReturn(List.of(adminView));
            
            // When
            PageResponse<CategoryAdminView> result = service.findAll(emptyParams, defaultPageable);
            
            // Then
            assertThat(result).isNotNull();
            assertThat(result.getContent()).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("Update Category")
    class UpdateCategory {
        
        @Test
        @DisplayName("Should update category successfully")
        void shouldUpdateCategorySuccessfully() {
            // Given
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(category));
            when(repository.existsByNameAndIdNot(anyString(), anyLong())).thenReturn(false);
            when(productService.getEntityById(anyLong())).thenReturn(product);
            when(repository.save(any(Category.class))).thenReturn(category);
            when(mapper.toAdminView(any(Category.class))).thenReturn(adminView);
            
            // When
            CategoryAdminView result = service.update(TEST_ID, input);
            
            // Then
            assertThat(result).isNotNull();
            verify(repository).save(category);
        }
        
        @Test
        @DisplayName("Should update product reference when changed")
        void shouldUpdateProductReferenceWhenChanged() {
            // Given
            Product newProduct = TestFixtures.createProduct(2L, "New Product");
            CategoryInput newInput = CategoryInput.builder()
                    .name("Test Category")
                    .productId(2L)
                    .build();
            
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(category));
            when(repository.existsByNameAndIdNot(anyString(), anyLong())).thenReturn(false);
            when(productService.getEntityById(2L)).thenReturn(newProduct);
            when(repository.save(any(Category.class))).thenReturn(category);
            when(mapper.toAdminView(any(Category.class))).thenReturn(adminView);
            
            // When
            service.update(TEST_ID, newInput);
            
            // Then
            verify(productService).getEntityById(2L);
        }
    }
    
    @Nested
    @DisplayName("Delete Category")
    class DeleteCategory {
        
        @Test
        @DisplayName("Should soft delete category successfully")
        void shouldSoftDeleteCategorySuccessfully() {
            // Given
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(category));
            when(repository.save(any(Category.class))).thenReturn(category);
            
            // When
            service.delete(TEST_ID);
            
            // Then
            assertThat(category.getActive()).isEqualTo(ActiveStatus.N);
            verify(repository).save(category);
        }
    }
    
    @Nested
    @DisplayName("Reactivate Category")
    class ReactivateCategory {
        
        @Test
        @DisplayName("Should reactivate category successfully")
        void shouldReactivateCategorySuccessfully() {
            // Given
            category.setActive(ActiveStatus.N);
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(category));
            when(repository.save(any(Category.class))).thenReturn(category);
            when(mapper.toAdminView(any(Category.class))).thenReturn(adminView);
            
            // When
            CategoryAdminView result = service.reactivate(TEST_ID);
            
            // Then
            assertThat(category.getActive()).isEqualTo(ActiveStatus.Y);
            verify(repository).save(category);
        }
    }
}
