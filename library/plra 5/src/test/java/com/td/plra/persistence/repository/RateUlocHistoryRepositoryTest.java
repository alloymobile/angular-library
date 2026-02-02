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
class RateUlocHistoryRepositoryTest {

    @Autowired private ProductRepository productRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private SubCategoryRepository subCategoryRepository;
    @Autowired private CvpCodeRepository cvpCodeRepository;
    @Autowired private AmountTierRepository amountTierRepository;
    @Autowired private RateUlocHistoryRepository repository;

    @Test
    void history_queries_work_including_pagedIdQuery() {
        Product product = new Product();
        product.setName("ULOC");
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

        CvpCode cvp = new CvpCode();
        cvp.setName("CVP1");
        cvp.setDetail("d");
        cvp.setActive(ActiveStatus.Y);
        cvp.setSubCategory(sub);
        cvp = cvpCodeRepository.save(cvp);

        AmountTier tier = new AmountTier();
        tier.setName("T1");
        tier.setDetail("d");
        tier.setActive(ActiveStatus.Y);
        tier.setMin(new BigDecimal("0.00"));
        tier.setMax(new BigDecimal("1000.00"));
        tier.setProduct(product);
        tier = amountTierRepository.save(tier);

        RateUlocHistory h1 = new RateUlocHistory();
        h1.setCvpCode(cvp);
        h1.setAmountTier(tier);
        h1.setActive(ActiveStatus.Y);
        h1.setStatus(RateStatus.SUPERSEDED);
        h1.setStartDate(LocalDate.now().minusDays(20));
        h1.setExpiryDate(LocalDate.now().minusDays(1));
        h1.setTargetRate(new BigDecimal("5.000000"));
        h1.setFloorRate(new BigDecimal("4.000000"));
        h1.setChangeId("CHG-BBBB2222");

        RateUlocHistory h2 = new RateUlocHistory();
        h2.setCvpCode(cvp);
        h2.setAmountTier(tier);
        h2.setActive(ActiveStatus.Y);
        h2.setStatus(RateStatus.SUPERSEDED);
        h2.setStartDate(LocalDate.now().minusDays(40));
        h2.setExpiryDate(LocalDate.now().minusDays(10));
        h2.setTargetRate(new BigDecimal("4.900000"));
        h2.setFloorRate(new BigDecimal("3.900000"));
        h2.setChangeId("CHG-BBBB2222");

        repository.save(h1);
        repository.save(h2);

        List<RateUlocHistory> byChange = repository.findByChangeIdOrderByCreatedOnDesc("CHG-BBBB2222");
        assertEquals(2, byChange.size());
        assertTrue(byChange.get(0).getCreatedOn().compareTo(byChange.get(1).getCreatedOn()) >= 0);

        Page<RateUlocHistory> page = repository.findByCvpCodeIdAndAmountTierId(cvp.getId(), tier.getId(), PageRequest.of(0, 1));
        assertEquals(1, page.getContent().size());
        assertEquals(2, page.getTotalElements());
    }
}
