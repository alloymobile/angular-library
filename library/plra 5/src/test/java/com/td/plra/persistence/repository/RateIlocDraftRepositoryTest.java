package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.*;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.RateStatus;
import com.td.plra.testsupport.AuditingTestConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
@Import(AuditingTestConfig.class)
class RateIlocDraftRepositoryTest {

    @Autowired private ProductRepository productRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private SubCategoryRepository subCategoryRepository;
    @Autowired private AmountTierRepository amountTierRepository;
    @Autowired private RateIlocDraftRepository repository;

    @Test
    void draft_queries_work_including_idBasedQuery() {
        Product product = new Product();
        product.setName("ILOC");
        product.setType("LOAN");
        product.setSecurityCode("SEC");
        product.setDetail("d");
        product.setActive(ActiveStatus.Y);
        product = productRepository.save(product);

        Category category = new Category();
        category.setName("Cat");
        category.setDetail("d");
        category.setActive(ActiveStatus.Y);
        category.setProduct(product);
        category = categoryRepository.save(category);

        SubCategory sub = new SubCategory();
        sub.setName("Sub");
        sub.setDetail("d");
        sub.setActive(ActiveStatus.Y);
        sub.setCategory(category);
        sub = subCategoryRepository.save(sub);

        AmountTier tier = new AmountTier();
        tier.setName("T1");
        tier.setDetail("d");
        tier.setActive(ActiveStatus.Y);
        tier.setMin(new BigDecimal("0.00"));
        tier.setMax(new BigDecimal("1000.00"));
        tier.setProduct(product);
        tier = amountTierRepository.save(tier);

        RateIlocDraft r1 = new RateIlocDraft();
        r1.setAmountTier(tier);
        r1.setSubCategory(sub);
        r1.setActive(ActiveStatus.Y);
        r1.setStatus(RateStatus.DRAFT);
        r1.setStartDate(LocalDate.now());
        r1.setExpiryDate(LocalDate.now().plusDays(30));
        r1.setTargetRate(new BigDecimal("4.100000"));
        r1.setFloorRate(new BigDecimal("3.100000"));

        repository.save(r1);

        assertEquals(1, repository.findByActive(ActiveStatus.Y).size());
        assertEquals(1, repository.findByStatus(RateStatus.DRAFT).size());
        assertEquals(1, repository.findByStatusAndActive(RateStatus.DRAFT, ActiveStatus.Y).size());
        assertEquals(1, repository.findByAmountTierAndSubCategory(tier, sub).size());
        assertTrue(repository.findByAmountTierAndSubCategoryAndActive(tier, sub, ActiveStatus.Y).isPresent());

        List<RateIlocDraft> byIds = repository.findByAmountTierIdAndSubCategoryIdAndActive(tier.getId(), sub.getId(), ActiveStatus.Y);
        assertEquals(1, byIds.size());
    }
}
