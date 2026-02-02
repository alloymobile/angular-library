package com.td.plra.repository;

import com.td.plra.common.BaseRepositoryTest;
import com.td.plra.persistence.entity.*;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.RateStatus;
import com.td.plra.persistence.repository.RateUlocActiveRepository;
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

@DisplayName("RateUlocActiveRepository Tests")
class RateUlocActiveRepositoryTest extends BaseRepositoryTest {
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Autowired
    private RateUlocActiveRepository repository;
    
    private Product product;
    private Category category;
    private SubCategory subCategory;
    private CvpCode cvpCode;
    private AmountTier amountTier;
    private RateUlocActive activeRate;
    
    @BeforeEach
    void setUp() {
        product = new Product();
        product.setName("Test Product");
        product.setType("ULOC");
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
        cvpCode.setDetail("Test CVP");
        cvpCode.setSubCategory(subCategory);
        cvpCode.setActive(ActiveStatus.Y);
        cvpCode = entityManager.persistAndFlush(cvpCode);
        
        amountTier = new AmountTier();
        amountTier.setName("Tier 1");
        amountTier.setMin(BigDecimal.ZERO);
        amountTier.setMax(new BigDecimal("50000"));
        amountTier.setProduct(product);
        amountTier.setActive(ActiveStatus.Y);
        amountTier = entityManager.persistAndFlush(amountTier);
        
        activeRate = new RateUlocActive();
        activeRate.setCvpCode(cvpCode);
        activeRate.setAmountTier(amountTier);
        activeRate.setTargetRate(new BigDecimal("8.25"));
        activeRate.setFloorRate(new BigDecimal("5.75"));
        activeRate.setStartDate(LocalDate.of(2025, 1, 1));
        activeRate.setExpiryDate(LocalDate.of(2025, 12, 31));
        activeRate.setDetail("Active ULOC rate");
        activeRate.setStatus(RateStatus.ACTIVE);
        activeRate.setChangeId("CHG-ULOC-00000001");
        activeRate.setActive(ActiveStatus.Y);
    }
    
    @Nested
    @DisplayName("findCurrentLiveRate")
    class FindCurrentLiveRate {
        
        @Test
        @DisplayName("Should find current live rate within date range")
        void shouldFindCurrentLiveRateWithinDateRange() {
            // Given
            entityManager.persistAndFlush(activeRate);
            LocalDate today = LocalDate.of(2025, 6, 15);
            
            // When
            Optional<RateUlocActive> result = repository.findCurrentLiveRate(
                    cvpCode.getId(), amountTier.getId(), ActiveStatus.Y, today);
            
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
            Optional<RateUlocActive> result = repository.findCurrentLiveRate(
                    cvpCode.getId(), amountTier.getId(), ActiveStatus.Y, beforeStart);
            
            // Then
            assertThat(result).isEmpty();
        }
    }
    
    @Nested
    @DisplayName("findRatesToSupersede")
    class FindRatesToSupersede {
        
        @Test
        @DisplayName("Should find rates to supersede")
        void shouldFindRatesToSupersede() {
            // Given
            entityManager.persistAndFlush(activeRate);
            LocalDate newStartDate = LocalDate.of(2025, 6, 1);
            
            // When
            List<RateUlocActive> result = repository.findRatesToSupersede(
                    cvpCode.getId(), amountTier.getId(), ActiveStatus.Y, newStartDate);
            
            // Then
            assertThat(result).hasSize(1);
        }
        
        @Test
        @DisplayName("Should return empty when no overlapping rates")
        void shouldReturnEmptyWhenNoOverlappingRates() {
            // Given
            entityManager.persistAndFlush(activeRate);
            LocalDate newStartDate = LocalDate.of(2026, 2, 1);
            
            // When
            List<RateUlocActive> result = repository.findRatesToSupersede(
                    cvpCode.getId(), amountTier.getId(), ActiveStatus.Y, newStartDate);
            
            // Then
            assertThat(result).isEmpty();
        }
    }
    
    @Nested
    @DisplayName("findByCvpCodeIdAndAmountTierIdAndActive")
    class FindByCvpCodeIdAndAmountTierIdAndActive {
        
        @Test
        @DisplayName("Should find rates by CVP code ID and tier ID")
        void shouldFindRatesByCvpCodeIdAndTierId() {
            // Given
            entityManager.persistAndFlush(activeRate);
            
            // When
            List<RateUlocActive> result = repository.findByCvpCodeIdAndAmountTierIdAndActive(
                    cvpCode.getId(), amountTier.getId(), ActiveStatus.Y);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("findByCvpCodeAndAmountTier")
    class FindByCvpCodeAndAmountTier {
        
        @Test
        @DisplayName("Should find rates by CVP code and tier")
        void shouldFindRatesByCvpCodeAndTier() {
            // Given
            entityManager.persistAndFlush(activeRate);
            
            // When
            List<RateUlocActive> result = repository.findByCvpCodeAndAmountTier(cvpCode, amountTier);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
}
