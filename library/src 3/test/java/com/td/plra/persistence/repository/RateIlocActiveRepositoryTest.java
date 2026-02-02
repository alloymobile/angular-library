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
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
@DisplayName("RateIlocActiveRepository Integration Tests")
class RateIlocActiveRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private RateIlocActiveRepository repository;

    private AmountTier amountTier;
    private SubCategory subCategory;

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

        subCategory = new SubCategory();
        subCategory.setName("Test SubCategory");
        subCategory.setCategory(category);
        subCategory.setActive(ActiveStatus.Y);
        subCategory.setCreatedBy("test-user");
        subCategory.setUpdatedBy("test-user");
        entityManager.persist(subCategory);

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

    private RateIlocActive newActive(String changeId, LocalDate start, LocalDate expiry) {
        RateIlocActive a = new RateIlocActive();
        a.setAmountTier(amountTier);
        a.setSubCategory(subCategory);
        a.setTargetRate(new BigDecimal("7.50"));
        a.setFloorRate(new BigDecimal("5.00"));
        a.setDiscretion(new BigDecimal("0.50"));
        a.setStartDate(start);
        a.setExpiryDate(expiry);
        a.setStatus(RateStatus.LIVE);
        a.setChangeId(changeId);
        a.setActive(ActiveStatus.Y);
        a.setCreatedBy("test-user");
        a.setUpdatedBy("test-user");
        return a;
    }

    @Test
    void shouldFindByAmountTierIdAndSubCategoryIdAndActive() {
        RateIlocActive saved = entityManager.persistAndFlush(newActive("CHG-1", LocalDate.now(), LocalDate.now().plusYears(1)));

        List<RateIlocActive> found = repository.findByAmountTierIdAndSubCategoryIdAndActive(
                saved.getAmountTier().getId(), saved.getSubCategory().getId(), ActiveStatus.Y);

        assertThat(found).hasSize(1);
        assertThat(found.get(0).getId()).isEqualTo(saved.getId());
    }

    @Test
    void shouldFindCurrentLiveRate() {
        RateIlocActive live = entityManager.persistAndFlush(newActive(
                "CHG-LIVE",
                LocalDate.now().minusDays(10),
                LocalDate.now().plusDays(10)));

        assertThat(repository.findCurrentLiveRate(
                live.getAmountTier().getId(),
                live.getSubCategory().getId(),
                ActiveStatus.Y,
                LocalDate.now())).isPresent();

        assertThat(repository.findCurrentLiveRate(
                live.getAmountTier().getId(),
                live.getSubCategory().getId(),
                ActiveStatus.Y,
                LocalDate.now().plusYears(2))).isEmpty();
    }

    @Test
    void shouldFindRatesToSupersede() {
        RateIlocActive existing = entityManager.persistAndFlush(newActive(
                "CHG-EXISTING",
                LocalDate.now().minusDays(30),
                LocalDate.now().plusDays(30)));

        List<RateIlocActive> toSupersede = repository.findRatesToSupersede(
                existing.getAmountTier().getId(),
                existing.getSubCategory().getId(),
                ActiveStatus.Y,
                LocalDate.now().minusDays(1));

        assertThat(toSupersede).isNotEmpty();
    }
}
