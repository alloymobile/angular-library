package com.td.plra.repository;

import com.td.plra.common.BaseRepositoryTest;
import com.td.plra.persistence.entity.*;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.RateStatus;
import com.td.plra.persistence.repository.RateUlocDraftRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("RateUlocDraftRepository Tests")
class RateUlocDraftRepositoryTest extends BaseRepositoryTest {
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Autowired
    private RateUlocDraftRepository repository;
    
    private Product product;
    private Category category;
    private SubCategory subCategory;
    private CvpCode cvpCode;
    private AmountTier amountTier;
    private RateUlocDraft draft;
    
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
        
        draft = new RateUlocDraft();
        draft.setCvpCode(cvpCode);
        draft.setAmountTier(amountTier);
        draft.setTargetRate(new BigDecimal("8.50"));
        draft.setFloorRate(new BigDecimal("6.00"));
        draft.setStartDate(LocalDate.of(2025, 2, 1));
        draft.setExpiryDate(LocalDate.of(2025, 12, 31));
        draft.setDetail("Test ULOC draft");
        draft.setStatus(RateStatus.DRAFT);
        draft.setChangeId("CHG-ULOC-00000001");
        draft.setActive(ActiveStatus.Y);
    }
    
    @Nested
    @DisplayName("findByCvpCode")
    class FindByCvpCode {
        
        @Test
        @DisplayName("Should find drafts by CVP code")
        void shouldFindDraftsByCvpCode() {
            // Given
            entityManager.persistAndFlush(draft);
            
            // When
            List<RateUlocDraft> result = repository.findByCvpCode(cvpCode);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("findByAmountTier")
    class FindByAmountTier {
        
        @Test
        @DisplayName("Should find drafts by amount tier")
        void shouldFindDraftsByAmountTier() {
            // Given
            entityManager.persistAndFlush(draft);
            
            // When
            List<RateUlocDraft> result = repository.findByAmountTier(amountTier);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("findByCvpCodeAndAmountTier")
    class FindByCvpCodeAndAmountTier {
        
        @Test
        @DisplayName("Should find drafts by CVP code and amount tier")
        void shouldFindDraftsByCvpCodeAndAmountTier() {
            // Given
            entityManager.persistAndFlush(draft);
            
            // When
            List<RateUlocDraft> result = repository.findByCvpCodeAndAmountTier(cvpCode, amountTier);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("findByCvpCodeIdAndAmountTierIdAndActive")
    class FindByCvpCodeIdAndAmountTierIdAndActive {
        
        @Test
        @DisplayName("Should find drafts by CVP code ID and tier ID")
        void shouldFindDraftsByCvpCodeIdAndTierId() {
            // Given
            entityManager.persistAndFlush(draft);
            
            // When
            List<RateUlocDraft> result = repository.findByCvpCodeIdAndAmountTierIdAndActive(
                    cvpCode.getId(), amountTier.getId(), ActiveStatus.Y);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("findByStatus")
    class FindByStatus {
        
        @Test
        @DisplayName("Should find drafts by status")
        void shouldFindDraftsByStatus() {
            // Given
            entityManager.persistAndFlush(draft);
            
            // When
            List<RateUlocDraft> result = repository.findByStatus(RateStatus.DRAFT);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
}
