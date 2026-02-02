package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.*;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.RateStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
@DisplayName("RateUlocHistoryRepository Integration Tests")
class RateUlocHistoryRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private RateUlocHistoryRepository repository;

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

    private RateUlocHistory newHistory(String changeId, LocalDateTime createdOn) {
        RateUlocHistory h = new RateUlocHistory();
        h.setAmountTier(amountTier);
        h.setCvpCode(cvpCode);
        h.setTargetRate(new BigDecimal("7.50"));
        h.setFloorRate(new BigDecimal("5.00"));
        h.setDiscretion(new BigDecimal("0.50"));
        h.setStartDate(LocalDate.now().minusDays(10));
        h.setExpiryDate(LocalDate.now().plusDays(10));
        h.setStatus(RateStatus.LIVE);
        h.setChangeId(changeId);
        h.setActive(ActiveStatus.Y);
        h.setCreatedBy("test-user");
        h.setUpdatedBy("test-user");
        h.setCreatedOn(createdOn);
        h.setUpdatedOn(createdOn);
        return h;
    }

    @Test
    void shouldFindByChangeIdOrderByCreatedOnDesc() {
        entityManager.persistAndFlush(newHistory("CHG-HIST", LocalDateTime.now().minusDays(2)));
        entityManager.persistAndFlush(newHistory("CHG-HIST", LocalDateTime.now().minusDays(1)));

        List<RateUlocHistory> list = repository.findByChangeIdOrderByCreatedOnDesc("CHG-HIST");
        assertThat(list).hasSize(2);
        assertThat(list.get(0).getCreatedOn()).isAfter(list.get(1).getCreatedOn());
    }
}
