package com.td.plra.repository;

import com.td.plra.common.BaseRepositoryTest;
import com.td.plra.persistence.entity.*;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.RateStatus;
import com.td.plra.persistence.repository.RateIlocHistoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("RateIlocHistoryRepository Tests")
class RateIlocHistoryRepositoryTest extends BaseRepositoryTest {
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Autowired
    private RateIlocHistoryRepository repository;
    
    private Product product;
    private Category category;
    private SubCategory subCategory;
    private AmountTier amountTier;
    private RateIlocHistory history;
    
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
        
        amountTier = new AmountTier();
        amountTier.setName("Tier 1");
        amountTier.setMin(BigDecimal.ZERO);
        amountTier.setMax(new BigDecimal("50000"));
        amountTier.setProduct(product);
        amountTier.setActive(ActiveStatus.Y);
        amountTier = entityManager.persistAndFlush(amountTier);
        
        history = new RateIlocHistory();
        history.setAmountTier(amountTier);
        history.setSubCategory(subCategory);
        history.setTargetRate(new BigDecimal("7.00"));
        history.setFloorRate(new BigDecimal("4.50"));
        history.setStartDate(LocalDate.of(2023, 1, 1));
        history.setExpiryDate(LocalDate.of(2023, 12, 31));
        history.setDetail("Historical rate");
        history.setStatus(RateStatus.EXPIRED);
        history.setChangeId("CHG-ILOC-HIST0001");
        history.setActive(ActiveStatus.Y);
    }
    
    @Nested
    @DisplayName("findByChangeIdOrderByCreatedOnDesc")
    class FindByChangeIdOrderByCreatedOnDesc {
        
        @Test
        @DisplayName("Should find history by change ID")
        void shouldFindHistoryByChangeId() {
            // Given
            entityManager.persistAndFlush(history);
            
            // When
            List<RateIlocHistory> result = repository.findByChangeIdOrderByCreatedOnDesc("CHG-ILOC-HIST0001");
            
            // Then
            assertThat(result).hasSize(1);
            assertThat(result.get(0).getChangeId()).isEqualTo("CHG-ILOC-HIST0001");
        }
        
        @Test
        @DisplayName("Should return empty when change ID not found")
        void shouldReturnEmptyWhenChangeIdNotFound() {
            // When
            List<RateIlocHistory> result = repository.findByChangeIdOrderByCreatedOnDesc("NON-EXISTENT");
            
            // Then
            assertThat(result).isEmpty();
        }
    }
    
    @Nested
    @DisplayName("findByAmountTierIdAndSubCategoryId")
    class FindByAmountTierIdAndSubCategoryId {
        
        @Test
        @DisplayName("Should find history by tier ID and subcategory ID with pagination")
        void shouldFindHistoryByTierIdAndSubCategoryId() {
            // Given
            entityManager.persistAndFlush(history);
            
            // When
            List<RateIlocHistory> result = repository.findByAmountTierIdAndSubCategoryId(
                    amountTier.getId(), subCategory.getId(), PageRequest.of(0, 10));
            
            // Then
            assertThat(result).hasSize(1);
        }
        
        @Test
        @DisplayName("Should limit results by page size")
        void shouldLimitResultsByPageSize() {
            // Given
            entityManager.persistAndFlush(history);
            
            RateIlocHistory history2 = new RateIlocHistory();
            history2.setAmountTier(amountTier);
            history2.setSubCategory(subCategory);
            history2.setTargetRate(new BigDecimal("6.50"));
            history2.setFloorRate(new BigDecimal("4.00"));
            history2.setStartDate(LocalDate.of(2022, 1, 1));
            history2.setExpiryDate(LocalDate.of(2022, 12, 31));
            history2.setStatus(RateStatus.SUPERSEDED);
            history2.setChangeId("CHG-ILOC-HIST0002");
            history2.setActive(ActiveStatus.Y);
            entityManager.persistAndFlush(history2);
            
            // When
            List<RateIlocHistory> result = repository.findByAmountTierIdAndSubCategoryId(
                    amountTier.getId(), subCategory.getId(), PageRequest.of(0, 1));
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("findByStatus")
    class FindByStatus {
        
        @Test
        @DisplayName("Should find history by status")
        void shouldFindHistoryByStatus() {
            // Given
            entityManager.persistAndFlush(history);
            
            // When
            List<RateIlocHistory> result = repository.findByStatus(RateStatus.EXPIRED);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("findByAmountTierAndSubCategory")
    class FindByAmountTierAndSubCategory {
        
        @Test
        @DisplayName("Should find history by tier and subcategory")
        void shouldFindHistoryByTierAndSubCategory() {
            // Given
            entityManager.persistAndFlush(history);
            
            // When
            List<RateIlocHistory> result = repository.findByAmountTierAndSubCategory(amountTier, subCategory);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
}
