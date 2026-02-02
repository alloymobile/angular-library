package com.td.plra.repository;

import com.td.plra.common.BaseRepositoryTest;
import com.td.plra.persistence.entity.Category;
import com.td.plra.persistence.entity.Product;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("CategoryRepository Tests")
class CategoryRepositoryTest extends BaseRepositoryTest {
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Autowired
    private CategoryRepository repository;
    
    private Product product;
    private Category category;
    
    @BeforeEach
    void setUp() {
        product = new Product();
        product.setName("Test Product");
        product.setType("HELOC");
        product.setActive(ActiveStatus.Y);
        product = entityManager.persistAndFlush(product);
        
        category = new Category();
        category.setName("Test Category");
        category.setDetail("Test category detail");
        category.setProduct(product);
        category.setActive(ActiveStatus.Y);
    }
    
    @Nested
    @DisplayName("findByName")
    class FindByName {
        
        @Test
        @DisplayName("Should find category by name")
        void shouldFindCategoryByName() {
            // Given
            entityManager.persistAndFlush(category);
            
            // When
            Optional<Category> result = repository.findByName("Test Category");
            
            // Then
            assertThat(result).isPresent();
            assertThat(result.get().getName()).isEqualTo("Test Category");
        }
    }
    
    @Nested
    @DisplayName("findByActive")
    class FindByActive {
        
        @Test
        @DisplayName("Should find all active categories")
        void shouldFindAllActiveCategories() {
            // Given
            entityManager.persistAndFlush(category);
            
            Category inactiveCategory = new Category();
            inactiveCategory.setName("Inactive Category");
            inactiveCategory.setProduct(product);
            inactiveCategory.setActive(ActiveStatus.N);
            entityManager.persistAndFlush(inactiveCategory);
            
            // When
            List<Category> result = repository.findByActive(ActiveStatus.Y);
            
            // Then
            assertThat(result).hasSize(1);
            assertThat(result.get(0).getName()).isEqualTo("Test Category");
        }
    }
    
    @Nested
    @DisplayName("findByProduct")
    class FindByProduct {
        
        @Test
        @DisplayName("Should find categories by product")
        void shouldFindCategoriesByProduct() {
            // Given
            entityManager.persistAndFlush(category);
            
            // When
            List<Category> result = repository.findByProduct(product);
            
            // Then
            assertThat(result).hasSize(1);
            assertThat(result.get(0).getProduct().getId()).isEqualTo(product.getId());
        }
    }
    
    @Nested
    @DisplayName("findByProductAndActive")
    class FindByProductAndActive {
        
        @Test
        @DisplayName("Should find active categories by product")
        void shouldFindActiveCategoriesByProduct() {
            // Given
            entityManager.persistAndFlush(category);
            
            Category inactiveCategory = new Category();
            inactiveCategory.setName("Inactive Category");
            inactiveCategory.setProduct(product);
            inactiveCategory.setActive(ActiveStatus.N);
            entityManager.persistAndFlush(inactiveCategory);
            
            // When
            List<Category> result = repository.findByProductAndActive(product, ActiveStatus.Y);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("existsByName")
    class ExistsByName {
        
        @Test
        @DisplayName("Should return true when category exists by name")
        void shouldReturnTrueWhenCategoryExistsByName() {
            // Given
            entityManager.persistAndFlush(category);
            
            // When
            boolean result = repository.existsByName("Test Category");
            
            // Then
            assertThat(result).isTrue();
        }
    }
}
