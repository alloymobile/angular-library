package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.AmountTier;
import com.td.plra.persistence.entity.Product;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.testsupport.AuditingTestConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
@Import(AuditingTestConfig.class)
class AmountTierRepositoryTest {

    @Autowired private ProductRepository productRepository;
    @Autowired private AmountTierRepository amountTierRepository;

    @Test
    void amountTier_queries_work() {
        Product product = new Product();
        product.setName("ILOC");
        product.setType("LOAN");
        product.setSecurityCode("SEC");
        product.setDetail("d");
        product.setActive(ActiveStatus.Y);
        product = productRepository.save(product);

        AmountTier t1 = new AmountTier();
        t1.setName("T1");
        t1.setDetail("tier-1");
        t1.setActive(ActiveStatus.Y);
        t1.setMin(new BigDecimal("0.00"));
        t1.setMax(new BigDecimal("9999.99"));
        t1.setProduct(product);

        AmountTier t2 = new AmountTier();
        t2.setName("T2");
        t2.setDetail("tier-2");
        t2.setActive(ActiveStatus.N);
        t2.setMin(new BigDecimal("10000.00"));
        t2.setMax(new BigDecimal("20000.00"));
        t2.setProduct(product);

        amountTierRepository.save(t1);
        amountTierRepository.save(t2);

        assertEquals(1, amountTierRepository.findByActive(ActiveStatus.Y).size());
        assertEquals(2, amountTierRepository.findByProduct(product).size());
        assertEquals(1, amountTierRepository.findByProductAndActive(product, ActiveStatus.Y).size());
        assertTrue(amountTierRepository.findByNameAndProduct("T1", product).isPresent());
        assertEquals(1, amountTierRepository.findByName("T2").size());
    }
}
