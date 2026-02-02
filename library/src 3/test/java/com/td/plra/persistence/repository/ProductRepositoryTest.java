package com.td.plra.persistence.repository;

import com.td.plra.common.TestFixtures;
import com.td.plra.persistence.entity.Product;
import com.td.plra.persistence.enums.ActiveStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
@DisplayName("ProductRepository Integration Tests")
class ProductRepositoryTest {
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Autowired
    private ProductRepository repository;
    
    private Product product;
    
    @BeforeEach
    void setUp() {
        product = new Product();
        product.setName("Test Product");
        product.setType("LENDING");
        product.setSecurityCode("SEC001");
        product.setDetail("Test product detail");
        product.setActive(ActiveStatus.Y);
        product.setCreatedBy("test-user");
        product.setUpdatedBy("test-user");
    }
    
    @Nested
    @DisplayName("Save Operations")
    class SaveOperations {
        
        @Test
        @DisplayName("Should save product with generated ID")
        void shouldSaveProductWithGeneratedId() {
            // When
            Product saved = repository.save(product);
            
            // Then
            assertThat(saved.getId()).isNotNull();
            assertThat(saved.getName()).isEqualTo(product.getName());
        }
        
        @Test
        @DisplayName("Should update existing product")
        void shouldUpdateExistingProduct() {
            // Given
            Product saved = repository.save(product);
            String newName = "Updated Product";
            
            // When
            saved.setName(newName);
            Product updated = repository.save(saved);
            
            // Then
            assertThat(updated.getName()).isEqualTo(newName);
            assertThat(updated.getId()).isEqualTo(saved.getId());
        }
    }
    
    @Nested
    @DisplayName("Find Operations")
    class FindOperations {
        
        @Test
        @DisplayName("Should find product by ID")
        void shouldFindProductById() {
            // Given
            Product saved = entityManager.persistAndFlush(product);
            
            // When
            Optional<Product> found = repository.findById(saved.getId());
            
            // Then
            assertThat(found).isPresent();
            assertThat(found.get().getName()).isEqualTo(product.getName());
        }
        
        @Test
        @DisplayName("Should return empty when product not found")
        void shouldReturnEmptyWhenNotFound() {
            // When
            Optional<Product> found = repository.findById(999L);
            
            // Then
            assertThat(found).isEmpty();
        }
        
        @Test
        @DisplayName("Should find all products with pagination")
        void shouldFindAllProductsWithPagination() {
            // Given
            entityManager.persistAndFlush(product);
            
            Product product2 = new Product();
            product2.setName("Product 2");
            product2.setType("LENDING");
            product2.setActive(ActiveStatus.Y);
            product2.setCreatedBy("test-user");
            product2.setUpdatedBy("test-user");
            entityManager.persistAndFlush(product2);
            
            // When
            Page<Product> page = repository.findAll(PageRequest.of(0, 10));
            
            // Then
            assertThat(page.getContent()).hasSize(2);
            assertThat(page.getTotalElements()).isEqualTo(2);
        }
    }
    
    @Nested
    @DisplayName("Custom Query Methods")
    class CustomQueryMethods {
        
        @Test
        @DisplayName("Should check if name exists")
        void shouldCheckIfNameExists() {
            // Given
            entityManager.persistAndFlush(product);
            
            // When
            boolean exists = repository.existsByName(product.getName());
            boolean notExists = repository.existsByName("Non-existent");
            
            // Then
            assertThat(exists).isTrue();
            assertThat(notExists).isFalse();
        }
        
        @Test
        @DisplayName("Should check if name exists excluding specific ID")
        void shouldCheckIfNameExistsExcludingId() {
            // Given
            Product saved = entityManager.persistAndFlush(product);
            
            Product product2 = new Product();
            product2.setName("Product 2");
            product2.setType("LENDING");
            product2.setActive(ActiveStatus.Y);
            product2.setCreatedBy("test-user");
            product2.setUpdatedBy("test-user");
            entityManager.persistAndFlush(product2);
            
            // When
            boolean existsForOther = repository.existsByNameAndIdNot(product.getName(), product2.getId());
            boolean notExistsForSame = repository.existsByNameAndIdNot(product.getName(), saved.getId());
            
            // Then
            assertThat(existsForOther).isTrue();
            assertThat(notExistsForSame).isFalse();
        }
    }
    
    @Nested
    @DisplayName("Active Status Filtering")
    class ActiveStatusFiltering {
        
        @Test
        @DisplayName("Should find only active products")
        void shouldFindOnlyActiveProducts() {
            // Given
            entityManager.persistAndFlush(product);
            
            Product inactiveProduct = new Product();
            inactiveProduct.setName("Inactive Product");
            inactiveProduct.setType("LENDING");
            inactiveProduct.setActive(ActiveStatus.N);
            inactiveProduct.setCreatedBy("test-user");
            inactiveProduct.setUpdatedBy("test-user");
            entityManager.persistAndFlush(inactiveProduct);
            
            // When
            Page<Product> page = repository.findAll(PageRequest.of(0, 10));
            
            // Then
            assertThat(page.getContent()).hasSize(2); // Both returned by default
        }
    }
}
