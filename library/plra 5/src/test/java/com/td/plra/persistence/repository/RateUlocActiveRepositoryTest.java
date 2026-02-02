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
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
@Import(AuditingTestConfig.class)
class RateUlocActiveRepositoryTest {

    @Autowired private ProductRepository productRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private SubCategoryRepository subCategoryRepository;
    @Autowired private CvpCodeRepository cvpCodeRepository;
    @Autowired private AmountTierRepository amountTierRepository;
    @Autowired private RateUlocActiveRepository repository;

    @Test
    void currentLiveRate_and_ratesToSupersede_and_idQuery_work() {
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

        RateUlocActive r1 = new RateUlocActive();
        r1.setCvpCode(cvp);
        r1.setAmountTier(tier);
        r1.setActive(ActiveStatus.Y);
        r1.setStatus(RateStatus.ACTIVE);
        r1.setStartDate(LocalDate.now().minusDays(10));
        r1.setExpiryDate(LocalDate.now().plusDays(10));
        r1.setTargetRate(new BigDecimal("5.100000"));
        r1.setFloorRate(new BigDecimal("4.100000"));

        repository.save(r1);

        Optional<RateUlocActive> current = repository.findCurrentLiveRate(cvp.getId(), tier.getId(), ActiveStatus.Y, LocalDate.now());
        assertTrue(current.isPresent());

        List<RateUlocActive> supersede = repository.findRatesToSupersede(cvp.getId(), tier.getId(), ActiveStatus.Y, LocalDate.now().plusDays(1));
        assertEquals(1, supersede.size());

        List<RateUlocActive> byIds = repository.findByCvpCodeIdAndAmountTierIdAndActive(cvp.getId(), tier.getId(), ActiveStatus.Y);
        assertEquals(1, byIds.size());
    }
}
