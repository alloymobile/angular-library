package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.*;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.RateStatus;
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

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
@DisplayName("RateIlocDraftRepository Integration Tests")
class RateIlocDraftRepositoryTest {
    
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
        // Create product
        product = new Product();
        product.setName("Test Product");
        product.setType("LENDING");
        product.setActive(ActiveStatus.Y);
        product.setCreatedBy("test-user");
        product.setUpdatedBy("test-user");
        entityManager.persist(product);
        
        // Create category
        category = new Category();
        category.setName("Test Category");
        category.setProduct(product);
        category.setActive(ActiveStatus.Y);
        category.setCreatedBy("test-user");
        category.setUpdatedBy("test-user");
        entityManager.persist(category);
        
        // Create subcategory
        subCategory = new SubCategory();
        subCategory.setName("Test SubCategory");
        subCategory.setCategory(category);
        subCategory.setActive(ActiveStatus.Y);
        subCategory.setCreatedBy("test-user");
        subCategory.setUpdatedBy("test-user");
        entityManager.persist(subCategory);
        
        // Create amount tier
        amountTier = new AmountTier();
        amountTier.setName("Tier 1");
        amountTier.setMin(new BigDecimal("0"));
        amountTier.setMax(new BigDecimal("100000"));
        amountTier.setProduct(product);
        amountTier.setActive(ActiveStatus.Y);
        amountTier.setCreatedBy("test-user");
        amountTier.setUpdatedBy("test-user");
        entityManager.persist(amountTier);
        
        // Create rate draft
        draft = new RateIlocDraft();
        draft.setAmountTier(amountTier);
        draft.setSubCategory(subCategory);
        draft.setTargetRate(new BigDecimal("7.50"));
        draft.setFloorRate(new BigDecimal("5.00"));
        draft.setDiscretion(new BigDecimal("0.50"));
        draft.setStartDate(LocalDate.now());
        draft.setExpiryDate(LocalDate.now().plusYears(1));
        draft.setStatus(RateStatus.DRAFT);
        draft.setChangeId("CHG-ILOC-TEST001");
        draft.setActive(ActiveStatus.Y);
        draft.setCreatedBy("test-user");
        draft.setUpdatedBy("test-user");
        
        entityManager.flush();
    }
    
    @Nested
    @DisplayName("Save Operations")
    class SaveOperations {
        
        @Test
        @DisplayName("Should save rate draft with generated ID")
        void shouldSaveRateDraftWithGeneratedId() {
            // When
            RateIlocDraft saved = repository.save(draft);
            entityManager.flush();
            
            // Then
            assertThat(saved.getId()).isNotNull();
            assertThat(saved.getTargetRate()).isEqualByComparingTo(new BigDecimal("7.50"));
            assertThat(saved.getStatus()).isEqualTo(RateStatus.DRAFT);
        }
    }
    
    @Nested
    @DisplayName("Find Operations")
    class FindOperations {
        
        @Test
        @DisplayName("Should find draft by ID")
        void shouldFindDraftById() {
            // Given
            RateIlocDraft saved = entityManager.persistAndFlush(draft);
            
            // When
            Optional<RateIlocDraft> found = repository.findById(saved.getId());
            
            // Then
            assertThat(found).isPresent();
            assertThat(found.get().getChangeId()).isEqualTo("CHG-ILOC-TEST001");
        }
        
        @Test
        @DisplayName("Should find all drafts with pagination")
        void shouldFindAllDraftsWithPagination() {
            // Given
            entityManager.persistAndFlush(draft);
            
            RateIlocDraft draft2 = new RateIlocDraft();
            draft2.setAmountTier(amountTier);
            draft2.setSubCategory(subCategory);
            draft2.setTargetRate(new BigDecimal("8.00"));
            draft2.setFloorRate(new BigDecimal("6.00"));
            draft2.setStartDate(LocalDate.now());
            draft2.setExpiryDate(LocalDate.now().plusYears(1));
            draft2.setStatus(RateStatus.PENDING_APPROVAL);
            draft2.setChangeId("CHG-ILOC-TEST002");
            draft2.setActive(ActiveStatus.Y);
            draft2.setCreatedBy("test-user");
            draft2.setUpdatedBy("test-user");
            entityManager.persistAndFlush(draft2);
            
            // When
            Page<RateIlocDraft> page = repository.findAll(PageRequest.of(0, 10));
            
            // Then
            assertThat(page.getContent()).hasSize(2);
        }
    }
    
    @Nested
    @DisplayName("Custom Query Methods")
    class CustomQueryMethods {
        
        @Test
        @DisplayName("Should find by amount tier and subcategory")
        void shouldFindByAmountTierAndSubCategory() {
            // Given
            entityManager.persistAndFlush(draft);
            
            // When
            List<RateIlocDraft> drafts = repository.findByAmountTierAndSubCategoryOrderByCreatedOnDesc(
                    amountTier, subCategory);
            
            // Then
            assertThat(drafts).hasSize(1);
            assertThat(drafts.get(0).getAmountTier().getId()).isEqualTo(amountTier.getId());
        }
        
        @Test
        @DisplayName("Should find by change ID")
        void shouldFindByChangeId() {
            // Given
            entityManager.persistAndFlush(draft);
            
            // When
            List<RateIlocDraft> drafts = repository.findByChangeIdOrderByCreatedOnDesc("CHG-ILOC-TEST001");
            
            // Then
            assertThat(drafts).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("Status Filtering")
    class StatusFiltering {
        
        @Test
        @DisplayName("Should find drafts by status")
        void shouldFindDraftsByStatus() {
            // Given
            entityManager.persistAndFlush(draft);
            
            RateIlocDraft approvedDraft = new RateIlocDraft();
            approvedDraft.setAmountTier(amountTier);
            approvedDraft.setSubCategory(subCategory);
            approvedDraft.setTargetRate(new BigDecimal("8.00"));
            approvedDraft.setFloorRate(new BigDecimal("6.00"));
            approvedDraft.setStartDate(LocalDate.now());
            approvedDraft.setExpiryDate(LocalDate.now().plusYears(1));
            approvedDraft.setStatus(RateStatus.APPROVED);
            approvedDraft.setChangeId("CHG-ILOC-TEST002");
            approvedDraft.setActive(ActiveStatus.Y);
            approvedDraft.setCreatedBy("test-user");
            approvedDraft.setUpdatedBy("test-user");
            entityManager.persistAndFlush(approvedDraft);
            
            // When
            List<RateIlocDraft> draftStatus = repository.findByStatusOrderByCreatedOnDesc(RateStatus.DRAFT);
            List<RateIlocDraft> approvedStatus = repository.findByStatusOrderByCreatedOnDesc(RateStatus.APPROVED);
            
            // Then
            assertThat(draftStatus).hasSize(1);
            assertThat(approvedStatus).hasSize(1);
        }
    }
}
