package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.Product;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.testsupport.AuditingTestConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
@Import(AuditingTestConfig.class)
class ProductRepositoryTest {

    @Autowired
    private ProductRepository repository;

    @Test
    void findByName_and_existsByName_and_findByActive_work() {
        Product p1 = new Product();
        p1.setName("ILOC");
        p1.setType("LOAN");
        p1.setSecurityCode("SEC1");
        p1.setDetail("detail-1");
        p1.setActive(ActiveStatus.Y);

        Product p2 = new Product();
        p2.setName("ULOC");
        p2.setType("LOAN");
        p2.setSecurityCode("SEC2");
        p2.setDetail("detail-2");
        p2.setActive(ActiveStatus.N);

        repository.save(p1);
        repository.save(p2);

        Optional<Product> found = repository.findByName("ILOC");
        assertTrue(found.isPresent());
        assertEquals("ILOC", found.get().getName());

        assertTrue(repository.existsByName("ULOC"));
        assertFalse(repository.existsByName("XYZ"));

        assertEquals(1, repository.findByActive(ActiveStatus.Y).size());
        assertTrue(repository.findByNameAndActive("ILOC", ActiveStatus.Y).isPresent());
    }
}
