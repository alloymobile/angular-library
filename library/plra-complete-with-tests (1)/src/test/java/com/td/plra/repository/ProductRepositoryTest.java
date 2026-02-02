package com.td.plra.repository;

import com.td.plra.common.BaseRepositoryTest;
import com.td.plra.persistence.entity.Product;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("ProductRepository Tests")
class ProductRepositoryTest extends BaseRepositoryTest {
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Autowired
    private ProductRepository repository;
    
    private Product product;
    
    @BeforeEach
    void setUp() {
        product = new Product();
        product.setName("Test Product");
        product.setType("HELOC");
        product.setSecurityCode("SEC001");
        product.setDetail("Test product detail");
        product.setActive(ActiveStatus.Y);
    }
    
    @Nested
    @DisplayName("findByName")
    class FindByName {
        
        @Test
        @DisplayName("Should find product by name")
        void shouldFindProductByName() {
            // Given
            entityManager.persistAndFlush(product);
            
            // When
            Optional<Product> result = repository.findByName("Test Product");
            
            // Then
            assertThat(result).isPresent();
            assertThat(result.get().getName()).isEqualTo("Test Product");
        }
        
        @Test
        @DisplayName("Should return empty when product not found by name")
        void shouldReturnEmptyWhenProductNotFoundByName() {
            // When
            Optional<Product> result = repository.findByName("Non-existent");
            
            // Then
            assertThat(result).isEmpty();
        }
    }
    
    @Nested
    @DisplayName("findByActive")
    class FindByActive {
        
        @Test
        @DisplayName("Should find all active products")
        void shouldFindAllActiveProducts() {
            // Given
            entityManager.persistAndFlush(product);
            
            Product inactiveProduct = new Product();
            inactiveProduct.setName("Inactive Product");
            inactiveProduct.setType("PLOC");
            inactiveProduct.setActive(ActiveStatus.N);
            entityManager.persistAndFlush(inactiveProduct);
            
            // When
            List<Product> result = repository.findByActive(ActiveStatus.Y);
            
            // Then
            assertThat(result).hasSize(1);
            assertThat(result.get(0).getName()).isEqualTo("Test Product");
        }
    }
    
    @Nested
    @DisplayName("findByNameAndActive")
    class FindByNameAndActive {
        
        @Test
        @DisplayName("Should find product by name and active status")
        void shouldFindProductByNameAndActiveStatus() {
            // Given
            entityManager.persistAndFlush(product);
            
            // When
            Optional<Product> result = repository.findByNameAndActive("Test Product", ActiveStatus.Y);
            
            // Then
            assertThat(result).isPresent();
        }
        
        @Test
        @DisplayName("Should return empty when product inactive")
        void shouldReturnEmptyWhenProductInactive() {
            // Given
            product.setActive(ActiveStatus.N);
            entityManager.persistAndFlush(product);
            
            // When
            Optional<Product> result = repository.findByNameAndActive("Test Product", ActiveStatus.Y);
            
            // Then
            assertThat(result).isEmpty();
        }
    }
    
    @Nested
    @DisplayName("existsByName")
    class ExistsByName {
        
        @Test
        @DisplayName("Should return true when product exists by name")
        void shouldReturnTrueWhenProductExistsByName() {
            // Given
            entityManager.persistAndFlush(product);
            
            // When
            boolean result = repository.existsByName("Test Product");
            
            // Then
            assertThat(result).isTrue();
        }
        
        @Test
        @DisplayName("Should return false when product does not exist by name")
        void shouldReturnFalseWhenProductDoesNotExistByName() {
            // When
            boolean result = repository.existsByName("Non-existent");
            
            // Then
            assertThat(result).isFalse();
        }
    }
    
    @Nested
    @DisplayName("CRUD Operations")
    class CrudOperations {
        
        @Test
        @DisplayName("Should save and retrieve product")
        void shouldSaveAndRetrieveProduct() {
            // Given & When
            Product saved = repository.save(product);
            entityManager.flush();
            entityManager.clear();
            
            // Then
            Optional<Product> found = repository.findById(saved.getId());
            assertThat(found).isPresent();
            assertThat(found.get().getName()).isEqualTo("Test Product");
        }
        
        @Test
        @DisplayName("Should update product")
        void shouldUpdateProduct() {
            // Given
            Product saved = entityManager.persistAndFlush(product);
            
            // When
            saved.setName("Updated Product");
            repository.save(saved);
            entityManager.flush();
            entityManager.clear();
            
            // Then
            Optional<Product> found = repository.findById(saved.getId());
            assertThat(found).isPresent();
            assertThat(found.get().getName()).isEqualTo("Updated Product");
        }
        
        @Test
        @DisplayName("Should delete product")
        void shouldDeleteProduct() {
            // Given
            Product saved = entityManager.persistAndFlush(product);
            Long id = saved.getId();
            
            // When
            repository.deleteById(id);
            entityManager.flush();
            
            // Then
            Optional<Product> found = repository.findById(id);
            assertThat(found).isEmpty();
        }
    }
}
