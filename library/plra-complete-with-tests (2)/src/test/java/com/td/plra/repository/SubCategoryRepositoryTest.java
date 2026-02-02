package com.td.plra.repository;

import com.td.plra.common.BaseRepositoryTest;
import com.td.plra.persistence.entity.Category;
import com.td.plra.persistence.entity.Product;
import com.td.plra.persistence.entity.SubCategory;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.repository.SubCategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("SubCategoryRepository Tests")
class SubCategoryRepositoryTest extends BaseRepositoryTest {
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Autowired
    private SubCategoryRepository repository;
    
    private Product product;
    private Category category;
    private SubCategory subCategory;
    
    @BeforeEach
    void setUp() {
        product = new Product();
        product.setName("Test Product");
        product.setType("HELOC");
        product.setActive(ActiveStatus.Y);
        product = entityManager.persistAndFlush(product);
        
        category = new Category();
        category.setName("Test Category");
        category.setProduct(product);
        category.setActive(ActiveStatus.Y);
        category = entityManager.persistAndFlush(category);
        
        subCategory = new SubCategory();
        subCategory.setName("Test SubCategory");
        subCategory.setDetail("Test subcategory detail");
        subCategory.setCategory(category);
        subCategory.setActive(ActiveStatus.Y);
    }
    
    @Nested
    @DisplayName("findByName")
    class FindByName {
        
        @Test
        @DisplayName("Should find subcategory by name")
        void shouldFindSubCategoryByName() {
            // Given
            entityManager.persistAndFlush(subCategory);
            
            // When
            Optional<SubCategory> result = repository.findByName("Test SubCategory");
            
            // Then
            assertThat(result).isPresent();
            assertThat(result.get().getName()).isEqualTo("Test SubCategory");
        }
    }
    
    @Nested
    @DisplayName("findByCategory")
    class FindByCategory {
        
        @Test
        @DisplayName("Should find subcategories by category")
        void shouldFindSubCategoriesByCategory() {
            // Given
            entityManager.persistAndFlush(subCategory);
            
            // When
            List<SubCategory> result = repository.findByCategory(category);
            
            // Then
            assertThat(result).hasSize(1);
            assertThat(result.get(0).getCategory().getId()).isEqualTo(category.getId());
        }
    }
    
    @Nested
    @DisplayName("findByCategoryAndActive")
    class FindByCategoryAndActive {
        
        @Test
        @DisplayName("Should find active subcategories by category")
        void shouldFindActiveSubCategoriesByCategory() {
            // Given
            entityManager.persistAndFlush(subCategory);
            
            SubCategory inactiveSubCategory = new SubCategory();
            inactiveSubCategory.setName("Inactive SubCategory");
            inactiveSubCategory.setCategory(category);
            inactiveSubCategory.setActive(ActiveStatus.N);
            entityManager.persistAndFlush(inactiveSubCategory);
            
            // When
            List<SubCategory> result = repository.findByCategoryAndActive(category, ActiveStatus.Y);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("findByActive")
    class FindByActive {
        
        @Test
        @DisplayName("Should find all active subcategories")
        void shouldFindAllActiveSubCategories() {
            // Given
            entityManager.persistAndFlush(subCategory);
            
            // When
            List<SubCategory> result = repository.findByActive(ActiveStatus.Y);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("existsByName")
    class ExistsByName {
        
        @Test
        @DisplayName("Should return true when subcategory exists")
        void shouldReturnTrueWhenSubCategoryExists() {
            // Given
            entityManager.persistAndFlush(subCategory);
            
            // When
            boolean result = repository.existsByName("Test SubCategory");
            
            // Then
            assertThat(result).isTrue();
        }
    }
}
