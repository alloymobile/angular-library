package com.td.plra.service;

import com.td.plra.application.exception.BadRequestException;
import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.common.BaseServiceTest;
import com.td.plra.common.TestEntityFactory;
import com.td.plra.persistence.entity.Category;
import com.td.plra.persistence.entity.SubCategory;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.repository.SubCategoryRepository;
import com.td.plra.service.category.CategoryService;
import com.td.plra.service.subcategory.SubCategoryService;
import com.td.plra.service.subcategory.binding.SubCategoryBinding;
import com.td.plra.service.subcategory.dto.SubCategoryAdminView;
import com.td.plra.service.subcategory.dto.SubCategoryInput;
import com.td.plra.service.subcategory.mapper.SubCategoryMapper;
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

@DisplayName("SubCategoryService Tests")
class SubCategoryServiceTest extends BaseServiceTest {
    
    @Mock
    private SubCategoryRepository repository;
    
    @Mock
    private SubCategoryMapper mapper;
    
    @Mock
    private SubCategoryBinding binding;
    
    @Mock
    private CategoryService categoryService;
    
    @InjectMocks
    private SubCategoryService service;
    
    private SubCategory subCategory;
    private Category category;
    private SubCategoryInput input;
    private SubCategoryAdminView adminView;
    
    @BeforeEach
    void setUp() {
        category = TestEntityFactory.createCategory();
        subCategory = TestEntityFactory.createSubCategory();
        input = TestEntityFactory.createSubCategoryInput();
        adminView = TestEntityFactory.createSubCategoryAdminView();
    }
    
    @Nested
    @DisplayName("Create SubCategory")
    class CreateSubCategory {
        
        @Test
        @DisplayName("Should create subcategory successfully")
        void shouldCreateSubCategorySuccessfully() {
            // Given
            when(repository.existsByName(input.getName())).thenReturn(false);
            when(categoryService.getEntityById(anyLong())).thenReturn(category);
            when(mapper.toEntity(input)).thenReturn(subCategory);
            when(repository.save(any(SubCategory.class))).thenReturn(subCategory);
            when(mapper.toAdminView(subCategory)).thenReturn(adminView);
            
            // When
            SubCategoryAdminView result = service.create(input);
            
            // Then
            assertThat(result).isNotNull();
            verify(repository).save(any(SubCategory.class));
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
    @DisplayName("Find SubCategory By ID")
    class FindById {
        
        @Test
        @DisplayName("Should find subcategory by ID")
        void shouldFindSubCategoryById() {
            // Given
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(subCategory));
            when(mapper.toAdminView(subCategory)).thenReturn(adminView);
            
            // When
            SubCategoryAdminView result = service.findById(TEST_ID);
            
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
    @DisplayName("Find All SubCategories")
    class FindAll {
        
        @Test
        @DisplayName("Should find all subcategories with pagination")
        void shouldFindAllSubCategoriesWithPagination() {
            // Given
            Page<SubCategory> page = new PageImpl<>(List.of(subCategory), defaultPageable, 1);
            when(binding.buildPredicate(emptyParams)).thenReturn(null);
            when(repository.findAll(defaultPageable)).thenReturn(page);
            when(mapper.toAdminViewList(anyList())).thenReturn(List.of(adminView));
            
            // When
            PageResponse<SubCategoryAdminView> result = service.findAll(emptyParams, defaultPageable);
            
            // Then
            assertThat(result).isNotNull();
            assertThat(result.getContent()).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("Update SubCategory")
    class UpdateSubCategory {
        
        @Test
        @DisplayName("Should update subcategory successfully")
        void shouldUpdateSubCategorySuccessfully() {
            // Given
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(subCategory));
            when(repository.existsByName(input.getName())).thenReturn(false);
            when(repository.save(any(SubCategory.class))).thenReturn(subCategory);
            when(mapper.toAdminView(subCategory)).thenReturn(adminView);
            
            // When
            SubCategoryAdminView result = service.update(TEST_ID, input);
            
            // Then
            assertThat(result).isNotNull();
            verify(repository).save(subCategory);
        }
    }
    
    @Nested
    @DisplayName("Delete SubCategory")
    class DeleteSubCategory {
        
        @Test
        @DisplayName("Should soft delete subcategory")
        void shouldSoftDeleteSubCategory() {
            // Given
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(subCategory));
            when(repository.save(any(SubCategory.class))).thenReturn(subCategory);
            
            // When
            service.delete(TEST_ID);
            
            // Then
            assertThat(subCategory.getActive()).isEqualTo(ActiveStatus.N);
            verify(repository).save(subCategory);
        }
    }
    
    @Nested
    @DisplayName("Find By Category")
    class FindByCategory {
        
        @Test
        @DisplayName("Should find subcategories by category ID")
        void shouldFindSubCategoriesByCategoryId() {
            // Given
            when(categoryService.getEntityById(TEST_ID)).thenReturn(category);
            when(repository.findByCategoryAndActive(category, ActiveStatus.Y))
                    .thenReturn(List.of(subCategory));
            when(mapper.toAdminViewList(anyList())).thenReturn(List.of(adminView));
            
            // When
            List<SubCategoryAdminView> result = service.findByCategoryId(TEST_ID);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
}
