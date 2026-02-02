package com.td.plra.repository;

import com.td.plra.common.BaseRepositoryTest;
import com.td.plra.persistence.entity.*;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.RateStatus;
import com.td.plra.persistence.repository.RateIlocDraftRepository;
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

@DisplayName("RateIlocDraftRepository Tests")
class RateIlocDraftRepositoryTest extends BaseRepositoryTest {
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Autowired
    private RateIlocDraftRepository repository;
    
    private Product product;
    private Category category;
    private SubCategory subCategory;
    private AmountTier amountTier;
    private RateIlocDraft draft;
    
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
        
        draft = new RateIlocDraft();
        draft.setAmountTier(amountTier);
        draft.setSubCategory(subCategory);
        draft.setTargetRate(new BigDecimal("7.50"));
        draft.setFloorRate(new BigDecimal("5.00"));
        draft.setStartDate(LocalDate.of(2025, 2, 1));
        draft.setExpiryDate(LocalDate.of(2025, 12, 31));
        draft.setDetail("Test draft");
        draft.setStatus(RateStatus.DRAFT);
        draft.setChangeId("CHG-ILOC-00000001");
        draft.setActive(ActiveStatus.Y);
    }
    
    @Nested
    @DisplayName("findByActive")
    class FindByActive {
        
        @Test
        @DisplayName("Should find all active drafts")
        void shouldFindAllActiveDrafts() {
            // Given
            entityManager.persistAndFlush(draft);
            
            // When
            List<RateIlocDraft> result = repository.findByActive(ActiveStatus.Y);
            
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
            List<RateIlocDraft> result = repository.findByStatus(RateStatus.DRAFT);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("findByStatusAndActive")
    class FindByStatusAndActive {
        
        @Test
        @DisplayName("Should find active drafts by status")
        void shouldFindActiveDraftsByStatus() {
            // Given
            entityManager.persistAndFlush(draft);
            
            // When
            List<RateIlocDraft> result = repository.findByStatusAndActive(RateStatus.DRAFT, ActiveStatus.Y);
            
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
            List<RateIlocDraft> result = repository.findByAmountTier(amountTier);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("findBySubCategory")
    class FindBySubCategory {
        
        @Test
        @DisplayName("Should find drafts by subcategory")
        void shouldFindDraftsBySubCategory() {
            // Given
            entityManager.persistAndFlush(draft);
            
            // When
            List<RateIlocDraft> result = repository.findBySubCategory(subCategory);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("findByAmountTierAndSubCategory")
    class FindByAmountTierAndSubCategory {
        
        @Test
        @DisplayName("Should find drafts by amount tier and subcategory")
        void shouldFindDraftsByAmountTierAndSubCategory() {
            // Given
            entityManager.persistAndFlush(draft);
            
            // When
            List<RateIlocDraft> result = repository.findByAmountTierAndSubCategory(amountTier, subCategory);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("findByAmountTierAndSubCategoryAndActive")
    class FindByAmountTierAndSubCategoryAndActive {
        
        @Test
        @DisplayName("Should find active draft by tier and subcategory")
        void shouldFindActiveDraftByTierAndSubCategory() {
            // Given
            entityManager.persistAndFlush(draft);
            
            // When
            Optional<RateIlocDraft> result = repository.findByAmountTierAndSubCategoryAndActive(
                    amountTier, subCategory, ActiveStatus.Y);
            
            // Then
            assertThat(result).isPresent();
        }
    }
    
    @Nested
    @DisplayName("findByAmountTierIdAndSubCategoryIdAndActive")
    class FindByAmountTierIdAndSubCategoryIdAndActive {
        
        @Test
        @DisplayName("Should find drafts by tier ID and subcategory ID")
        void shouldFindDraftsByTierIdAndSubCategoryId() {
            // Given
            entityManager.persistAndFlush(draft);
            
            // When
            List<RateIlocDraft> result = repository.findByAmountTierIdAndSubCategoryIdAndActive(
                    amountTier.getId(), subCategory.getId(), ActiveStatus.Y);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("findByAmountTierAndSubCategoryAndStatus")
    class FindByAmountTierAndSubCategoryAndStatus {
        
        @Test
        @DisplayName("Should find drafts by tier, subcategory and status")
        void shouldFindDraftsByTierSubCategoryAndStatus() {
            // Given
            entityManager.persistAndFlush(draft);
            
            // When
            List<RateIlocDraft> result = repository.findByAmountTierAndSubCategoryAndStatus(
                    amountTier, subCategory, RateStatus.DRAFT);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
}
