package com.td.plra.repository;

import com.td.plra.common.BaseRepositoryTest;
import com.td.plra.persistence.entity.Category;
import com.td.plra.persistence.entity.CvpCode;
import com.td.plra.persistence.entity.Product;
import com.td.plra.persistence.entity.SubCategory;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.repository.CvpCodeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("CvpCodeRepository Tests")
class CvpCodeRepositoryTest extends BaseRepositoryTest {
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Autowired
    private CvpCodeRepository repository;
    
    private Product product;
    private Category category;
    private SubCategory subCategory;
    private CvpCode cvpCode;
    
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
        subCategory.setCategory(category);
        subCategory.setActive(ActiveStatus.Y);
        subCategory = entityManager.persistAndFlush(subCategory);
        
        cvpCode = new CvpCode();
        cvpCode.setName("CVP001");
        cvpCode.setDetail("Customer Value Proposition 1");
        cvpCode.setSubCategory(subCategory);
        cvpCode.setActive(ActiveStatus.Y);
    }
    
    @Nested
    @DisplayName("findByName")
    class FindByName {
        
        @Test
        @DisplayName("Should find CVP code by name")
        void shouldFindCvpCodeByName() {
            // Given
            entityManager.persistAndFlush(cvpCode);
            
            // When
            Optional<CvpCode> result = repository.findByName("CVP001");
            
            // Then
            assertThat(result).isPresent();
            assertThat(result.get().getName()).isEqualTo("CVP001");
        }
    }
    
    @Nested
    @DisplayName("findByActive")
    class FindByActive {
        
        @Test
        @DisplayName("Should find all active CVP codes")
        void shouldFindAllActiveCvpCodes() {
            // Given
            entityManager.persistAndFlush(cvpCode);
            
            // When
            List<CvpCode> result = repository.findByActive(ActiveStatus.Y);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("findBySubCategory")
    class FindBySubCategory {
        
        @Test
        @DisplayName("Should find CVP codes by subcategory")
        void shouldFindCvpCodesBySubCategory() {
            // Given
            entityManager.persistAndFlush(cvpCode);
            
            // When
            List<CvpCode> result = repository.findBySubCategory(subCategory);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("findBySubCategoryAndActive")
    class FindBySubCategoryAndActive {
        
        @Test
        @DisplayName("Should find active CVP codes by subcategory")
        void shouldFindActiveCvpCodesBySubCategory() {
            // Given
            entityManager.persistAndFlush(cvpCode);
            
            CvpCode inactiveCvpCode = new CvpCode();
            inactiveCvpCode.setName("CVP002");
            inactiveCvpCode.setSubCategory(subCategory);
            inactiveCvpCode.setActive(ActiveStatus.N);
            entityManager.persistAndFlush(inactiveCvpCode);
            
            // When
            List<CvpCode> result = repository.findBySubCategoryAndActive(subCategory, ActiveStatus.Y);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("existsByName")
    class ExistsByName {
        
        @Test
        @DisplayName("Should return true when CVP code exists")
        void shouldReturnTrueWhenCvpCodeExists() {
            // Given
            entityManager.persistAndFlush(cvpCode);
            
            // When
            boolean result = repository.existsByName("CVP001");
            
            // Then
            assertThat(result).isTrue();
        }
    }
}
