package com.td.plra.repository;

import com.td.plra.common.BaseRepositoryTest;
import com.td.plra.persistence.entity.*;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.RateStatus;
import com.td.plra.persistence.repository.RateUlocHistoryRepository;
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

@DisplayName("RateUlocHistoryRepository Tests")
class RateUlocHistoryRepositoryTest extends BaseRepositoryTest {
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Autowired
    private RateUlocHistoryRepository repository;
    
    private Product product;
    private Category category;
    private SubCategory subCategory;
    private CvpCode cvpCode;
    private AmountTier amountTier;
    private RateUlocHistory history;
    
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
        
        history = new RateUlocHistory();
        history.setCvpCode(cvpCode);
        history.setAmountTier(amountTier);
        history.setTargetRate(new BigDecimal("8.00"));
        history.setFloorRate(new BigDecimal("5.50"));
        history.setStartDate(LocalDate.of(2023, 1, 1));
        history.setExpiryDate(LocalDate.of(2023, 12, 31));
        history.setDetail("Historical ULOC rate");
        history.setStatus(RateStatus.EXPIRED);
        history.setChangeId("CHG-ULOC-HIST0001");
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
            List<RateUlocHistory> result = repository.findByChangeIdOrderByCreatedOnDesc("CHG-ULOC-HIST0001");
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("findByCvpCodeIdAndAmountTierId")
    class FindByCvpCodeIdAndAmountTierId {
        
        @Test
        @DisplayName("Should find history by CVP code ID and tier ID")
        void shouldFindHistoryByCvpCodeIdAndTierId() {
            // Given
            entityManager.persistAndFlush(history);
            
            // When
            List<RateUlocHistory> result = repository.findByCvpCodeIdAndAmountTierId(
                    cvpCode.getId(), amountTier.getId(), PageRequest.of(0, 10));
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("findByCvpCodeAndAmountTier")
    class FindByCvpCodeAndAmountTier {
        
        @Test
        @DisplayName("Should find history by CVP code and tier")
        void shouldFindHistoryByCvpCodeAndTier() {
            // Given
            entityManager.persistAndFlush(history);
            
            // When
            List<RateUlocHistory> result = repository.findByCvpCodeAndAmountTier(cvpCode, amountTier);
            
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
            List<RateUlocHistory> result = repository.findByStatus(RateStatus.EXPIRED);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
}
