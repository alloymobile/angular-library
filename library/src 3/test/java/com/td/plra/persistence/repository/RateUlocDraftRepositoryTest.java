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
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
@DisplayName("RateUlocDraftRepository Integration Tests")
class RateUlocDraftRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private RateUlocDraftRepository repository;

    private AmountTier amountTier;
    private CvpCode cvpCode;

    @BeforeEach
    void setUp() {
        Product product = new Product();
        product.setName("Test Product");
        product.setType("LENDING");
        product.setActive(ActiveStatus.Y);
        product.setCreatedBy("test-user");
        product.setUpdatedBy("test-user");
        entityManager.persist(product);

        Category category = new Category();
        category.setName("Test Category");
        category.setProduct(product);
        category.setActive(ActiveStatus.Y);
        category.setCreatedBy("test-user");
        category.setUpdatedBy("test-user");
        entityManager.persist(category);

        SubCategory subCategory = new SubCategory();
        subCategory.setName("Test SubCategory");
        subCategory.setCategory(category);
        subCategory.setActive(ActiveStatus.Y);
        subCategory.setCreatedBy("test-user");
        subCategory.setUpdatedBy("test-user");
        entityManager.persist(subCategory);

        cvpCode = new CvpCode();
        cvpCode.setName("CVP001");
        cvpCode.setSubCategory(subCategory);
        cvpCode.setActive(ActiveStatus.Y);
        cvpCode.setCreatedBy("test-user");
        cvpCode.setUpdatedBy("test-user");
        entityManager.persist(cvpCode);

        amountTier = new AmountTier();
        amountTier.setName("Tier 1");
        amountTier.setMin(new BigDecimal("0"));
        amountTier.setMax(new BigDecimal("100000"));
        amountTier.setProduct(product);
        amountTier.setActive(ActiveStatus.Y);
        amountTier.setCreatedBy("test-user");
        amountTier.setUpdatedBy("test-user");
        entityManager.persist(amountTier);

        entityManager.flush();
    }

    private RateUlocDraft newDraft(String changeId, RateStatus status) {
        RateUlocDraft d = new RateUlocDraft();
        d.setAmountTier(amountTier);
        d.setCvpCode(cvpCode);
        d.setTargetRate(new BigDecimal("7.50"));
        d.setFloorRate(new BigDecimal("5.00"));
        d.setDiscretion(new BigDecimal("0.50"));
        d.setStartDate(LocalDate.now());
        d.setExpiryDate(LocalDate.now().plusYears(1));
        d.setStatus(status);
        d.setChangeId(changeId);
        d.setActive(ActiveStatus.Y);
        d.setCreatedBy("test-user");
        d.setUpdatedBy("test-user");
        return d;
    }

    @Nested
    class FindOperations {

        @Test
        void shouldSaveAndFindById() {
            RateUlocDraft saved = repository.save(newDraft("CHG-ULOC-1", RateStatus.DRAFT));
            entityManager.flush();

            Optional<RateUlocDraft> found = repository.findById(saved.getId());
            assertThat(found).isPresent();
            assertThat(found.get().getChangeId()).isEqualTo("CHG-ULOC-1");
        }

        @Test
        void shouldFindByCvpCodeAndAmountTierAndActive() {
            entityManager.persistAndFlush(newDraft("CHG-ULOC-1", RateStatus.DRAFT));

            assertThat(repository.findByCvpCodeAndAmountTierAndActive(cvpCode, amountTier, ActiveStatus.Y)).isPresent();
            assertThat(repository.findByCvpCodeAndAmountTierAndActive(cvpCode, amountTier, ActiveStatus.N)).isEmpty();
        }

        @Test
        void shouldFindByStatusOrder() {
            entityManager.persistAndFlush(newDraft("CHG-ULOC-1", RateStatus.DRAFT));
            entityManager.persistAndFlush(newDraft("CHG-ULOC-2", RateStatus.APPROVED));

            List<RateUlocDraft> drafts = repository.findByStatus(RateStatus.DRAFT);
            List<RateUlocDraft> approved = repository.findByStatus(RateStatus.APPROVED);

            assertThat(drafts).hasSize(1);
            assertThat(approved).hasSize(1);
        }

        @Test
        void shouldFindByStatusAndActive() {
            RateUlocDraft d1 = newDraft("CHG-ULOC-1", RateStatus.DRAFT);
            d1.setActive(ActiveStatus.Y);

            RateUlocDraft d2 = newDraft("CHG-ULOC-2", RateStatus.DRAFT);
            d2.setActive(ActiveStatus.N);

            entityManager.persistAndFlush(d1);
            entityManager.persistAndFlush(d2);

            assertThat(repository.findByStatusAndActive(RateStatus.DRAFT, ActiveStatus.Y)).hasSize(1);
            assertThat(repository.findByStatusAndActive(RateStatus.DRAFT, ActiveStatus.N)).hasSize(1);
        }
    }
}
