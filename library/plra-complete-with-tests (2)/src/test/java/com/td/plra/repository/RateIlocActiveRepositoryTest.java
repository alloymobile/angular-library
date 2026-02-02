package com.td.plra.repository;

import com.td.plra.common.BaseRepositoryTest;
import com.td.plra.persistence.entity.*;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.RateStatus;
import com.td.plra.persistence.repository.RateIlocActiveRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("RateIlocActiveRepository Tests")
class RateIlocActiveRepositoryTest extends BaseRepositoryTest {
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Autowired
    private RateIlocActiveRepository repository;
    
    private Product product;
    private Category category;
    private SubCategory subCategory;
    private AmountTier amountTier;
    private RateIlocActive activeRate;
    
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
        
        activeRate = new RateIlocActive();
        activeRate.setAmountTier(amountTier);
        activeRate.setSubCategory(subCategory);
        activeRate.setTargetRate(new BigDecimal("7.25"));
        activeRate.setFloorRate(new BigDecimal("4.75"));
        activeRate.setStartDate(LocalDate.of(2025, 1, 1));
        activeRate.setExpiryDate(LocalDate.of(2025, 12, 31));
        activeRate.setDetail("Active rate");
        activeRate.setStatus(RateStatus.ACTIVE);
        activeRate.setChangeId("CHG-ILOC-00000001");
        activeRate.setActive(ActiveStatus.Y);
    }
    
    @Nested
    @DisplayName("findByActive")
    class FindByActive {
        
        @Test
        @DisplayName("Should find all active rates")
        void shouldFindAllActiveRates() {
            // Given
            entityManager.persistAndFlush(activeRate);
            
            // When
            List<RateIlocActive> result = repository.findByActive(ActiveStatus.Y);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("findByStatus")
    class FindByStatus {
        
        @Test
        @DisplayName("Should find rates by status")
        void shouldFindRatesByStatus() {
            // Given
            entityManager.persistAndFlush(activeRate);
            
            // When
            List<RateIlocActive> result = repository.findByStatus(RateStatus.ACTIVE);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("findByAmountTierIdAndSubCategoryIdAndActive")
    class FindByAmountTierIdAndSubCategoryIdAndActive {
        
        @Test
        @DisplayName("Should find rates by tier ID and subcategory ID")
        void shouldFindRatesByTierIdAndSubCategoryId() {
            // Given
            entityManager.persistAndFlush(activeRate);
            
            // When
            List<RateIlocActive> result = repository.findByAmountTierIdAndSubCategoryIdAndActive(
                    amountTier.getId(), subCategory.getId(), ActiveStatus.Y);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("findCurrentLiveRate")
    class FindCurrentLiveRate {
        
        @Test
        @DisplayName("Should find current live rate within date range")
        void shouldFindCurrentLiveRateWithinDateRange() {
            // Given
            entityManager.persistAndFlush(activeRate);
            LocalDate today = LocalDate.of(2025, 6, 15); // Mid-year
            
            // When
            Optional<RateIlocActive> result = repository.findCurrentLiveRate(
                    amountTier.getId(), subCategory.getId(), ActiveStatus.Y, today);
            
            // Then
            assertThat(result).isPresent();
        }
        
        @Test
        @DisplayName("Should return empty when date is before start date")
        void shouldReturnEmptyWhenDateBeforeStartDate() {
            // Given
            entityManager.persistAndFlush(activeRate);
            LocalDate beforeStart = LocalDate.of(2024, 12, 1);
            
            // When
            Optional<RateIlocActive> result = repository.findCurrentLiveRate(
                    amountTier.getId(), subCategory.getId(), ActiveStatus.Y, beforeStart);
            
            // Then
            assertThat(result).isEmpty();
        }
        
        @Test
        @DisplayName("Should return empty when date is after expiry date")
        void shouldReturnEmptyWhenDateAfterExpiryDate() {
            // Given
            entityManager.persistAndFlush(activeRate);
            LocalDate afterExpiry = LocalDate.of(2026, 1, 15);
            
            // When
            Optional<RateIlocActive> result = repository.findCurrentLiveRate(
                    amountTier.getId(), subCategory.getId(), ActiveStatus.Y, afterExpiry);
            
            // Then
            assertThat(result).isEmpty();
        }
    }
    
    @Nested
    @DisplayName("findRatesToSupersede")
    class FindRatesToSupersede {
        
        @Test
        @DisplayName("Should find rates to supersede when expiry overlaps with new start date")
        void shouldFindRatesToSupersedeWhenExpiryOverlaps() {
            // Given
            entityManager.persistAndFlush(activeRate);
            LocalDate newStartDate = LocalDate.of(2025, 6, 1);
            
            // When
            List<RateIlocActive> result = repository.findRatesToSupersede(
                    amountTier.getId(), subCategory.getId(), ActiveStatus.Y, newStartDate);
            
            // Then
            assertThat(result).hasSize(1);
        }
        
        @Test
        @DisplayName("Should return empty when no overlapping rates")
        void shouldReturnEmptyWhenNoOverlappingRates() {
            // Given
            entityManager.persistAndFlush(activeRate);
            LocalDate newStartDate = LocalDate.of(2026, 2, 1); // After existing expiry
            
            // When
            List<RateIlocActive> result = repository.findRatesToSupersede(
                    amountTier.getId(), subCategory.getId(), ActiveStatus.Y, newStartDate);
            
            // Then
            assertThat(result).isEmpty();
        }
        
        @Test
        @DisplayName("Should find multiple rates to supersede")
        void shouldFindMultipleRatesToSupersede() {
            // Given
            entityManager.persistAndFlush(activeRate);
            
            // Add another future rate
            RateIlocActive futureRate = new RateIlocActive();
            futureRate.setAmountTier(amountTier);
            futureRate.setSubCategory(subCategory);
            futureRate.setTargetRate(new BigDecimal("7.50"));
            futureRate.setFloorRate(new BigDecimal("5.00"));
            futureRate.setStartDate(LocalDate.of(2026, 1, 1));
            futureRate.setExpiryDate(LocalDate.of(2026, 12, 31));
            futureRate.setStatus(RateStatus.ACTIVE);
            futureRate.setChangeId("CHG-ILOC-00000002");
            futureRate.setActive(ActiveStatus.Y);
            entityManager.persistAndFlush(futureRate);
            
            LocalDate newStartDate = LocalDate.of(2025, 6, 1);
            
            // When
            List<RateIlocActive> result = repository.findRatesToSupersede(
                    amountTier.getId(), subCategory.getId(), ActiveStatus.Y, newStartDate);
            
            // Then
            assertThat(result).hasSize(2);
        }
    }
    
    @Nested
    @DisplayName("findByAmountTierAndSubCategory")
    class FindByAmountTierAndSubCategory {
        
        @Test
        @DisplayName("Should find rates by tier and subcategory")
        void shouldFindRatesByTierAndSubCategory() {
            // Given
            entityManager.persistAndFlush(activeRate);
            
            // When
            List<RateIlocActive> result = repository.findByAmountTierAndSubCategory(amountTier, subCategory);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
}
