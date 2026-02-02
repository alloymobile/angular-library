package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.*;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.RateStatus;
import com.td.plra.testsupport.AuditingTestConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
@Import(AuditingTestConfig.class)
class RateIlocHistoryRepositoryTest {

    @Autowired private ProductRepository productRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private SubCategoryRepository subCategoryRepository;
    @Autowired private AmountTierRepository amountTierRepository;
    @Autowired private RateIlocHistoryRepository repository;

    @Test
    void history_queries_work_including_pagedIdQuery() {
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

        RateIlocHistory h1 = new RateIlocHistory();
        h1.setAmountTier(tier);
        h1.setSubCategory(sub);
        h1.setActive(ActiveStatus.Y);
        h1.setStatus(RateStatus.SUPERSEDED);
        h1.setStartDate(LocalDate.now().minusDays(20));
        h1.setExpiryDate(LocalDate.now().minusDays(1));
        h1.setTargetRate(new BigDecimal("4.000000"));
        h1.setFloorRate(new BigDecimal("3.000000"));
        h1.setChangeId("CHG-AAAA1111");

        RateIlocHistory h2 = new RateIlocHistory();
        h2.setAmountTier(tier);
        h2.setSubCategory(sub);
        h2.setActive(ActiveStatus.Y);
        h2.setStatus(RateStatus.SUPERSEDED);
        h2.setStartDate(LocalDate.now().minusDays(40));
        h2.setExpiryDate(LocalDate.now().minusDays(10));
        h2.setTargetRate(new BigDecimal("3.900000"));
        h2.setFloorRate(new BigDecimal("2.900000"));
        h2.setChangeId("CHG-AAAA1111");

        repository.save(h1);
        repository.save(h2);

        List<RateIlocHistory> byChange = repository.findByChangeIdOrderByCreatedOnDesc("CHG-AAAA1111");
        assertEquals(2, byChange.size());
        assertTrue(byChange.get(0).getCreatedOn().compareTo(byChange.get(1).getCreatedOn()) >= 0);

        Page<RateIlocHistory> page = repository.findByAmountTierIdAndSubCategoryId(tier.getId(), sub.getId(), PageRequest.of(0, 1));
        assertEquals(1, page.getContent().size());
        assertEquals(2, page.getTotalElements());
    }
}
