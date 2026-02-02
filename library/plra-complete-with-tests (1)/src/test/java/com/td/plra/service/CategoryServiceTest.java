package com.td.plra.service;

import com.td.plra.application.exception.BadRequestException;
import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.common.BaseServiceTest;
import com.td.plra.common.TestEntityFactory;
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
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyLong;
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
        product = TestEntityFactory.createProduct();
        category = TestEntityFactory.createCategory();
        input = TestEntityFactory.createCategoryInput();
        adminView = TestEntityFactory.createCategoryAdminView();
    }
    
    @Nested
    @DisplayName("Create Category")
    class CreateCategory {
        
        @Test
        @DisplayName("Should create category successfully")
        void shouldCreateCategorySuccessfully() {
            // Given
            when(repository.existsByName(input.getName())).thenReturn(false);
            when(productService.getEntityById(anyLong())).thenReturn(product);
            when(mapper.toEntity(input)).thenReturn(category);
            when(repository.save(any(Category.class))).thenReturn(category);
            when(mapper.toAdminView(category)).thenReturn(adminView);
            
            // When
            CategoryAdminView result = service.create(input);
            
            // Then
            assertThat(result).isNotNull();
            verify(repository).save(any(Category.class));
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
            when(repository.findById(TEST_ID)).thenReturn(Optional.empty());
            
            // When/Then
            assertThatThrownBy(() -> service.findById(TEST_ID))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }
    
    @Nested
    @DisplayName("Find All Categories")
    class FindAll {
        
        @Test
        @DisplayName("Should find all categories with pagination")
        void shouldFindAllCategoriesWithPagination() {
            // Given
            Page<Category> page = new PageImpl<>(List.of(category), defaultPageable, 1);
            when(binding.buildPredicate(emptyParams)).thenReturn(null);
            when(repository.findAll(defaultPageable)).thenReturn(page);
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
            when(repository.existsByName(input.getName())).thenReturn(false);
            when(repository.save(any(Category.class))).thenReturn(category);
            when(mapper.toAdminView(category)).thenReturn(adminView);
            
            // When
            CategoryAdminView result = service.update(TEST_ID, input);
            
            // Then
            assertThat(result).isNotNull();
            verify(mapper).updateEntity(input, category);
            verify(repository).save(category);
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
    @DisplayName("Find By Product")
    class FindByProduct {
        
        @Test
        @DisplayName("Should find categories by product ID")
        void shouldFindCategoriesByProductId() {
            // Given
            when(productService.getEntityById(TEST_ID)).thenReturn(product);
            when(repository.findByProductAndActive(product, ActiveStatus.Y))
                    .thenReturn(List.of(category));
            when(mapper.toAdminViewList(anyList())).thenReturn(List.of(adminView));
            
            // When
            List<CategoryAdminView> result = service.findByProductId(TEST_ID);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
}
