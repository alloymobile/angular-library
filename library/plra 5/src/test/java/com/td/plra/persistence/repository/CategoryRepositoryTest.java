package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.Category;
import com.td.plra.persistence.entity.Product;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.testsupport.AuditingTestConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
@Import(AuditingTestConfig.class)
class CategoryRepositoryTest {

    @Autowired private ProductRepository productRepository;
    @Autowired private CategoryRepository categoryRepository;

    @Test
    void category_queries_work() {
        Product product = new Product();
        product.setName("ILOC");
        product.setType("LOAN");
        product.setSecurityCode("SEC");
        product.setDetail("d");
        product.setActive(ActiveStatus.Y);
        product = productRepository.save(product);

        Category c1 = new Category();
        c1.setName("Cat-A");
        c1.setDetail("A");
        c1.setActive(ActiveStatus.Y);
        c1.setProduct(product);

        Category c2 = new Category();
        c2.setName("Cat-B");
        c2.setDetail("B");
        c2.setActive(ActiveStatus.N);
        c2.setProduct(product);

        categoryRepository.save(c1);
        categoryRepository.save(c2);

        assertTrue(categoryRepository.findByName("Cat-A").isPresent());
        assertTrue(categoryRepository.existsByName("Cat-B"));

        assertEquals(1, categoryRepository.findByActive(ActiveStatus.Y).size());
        assertEquals(2, categoryRepository.findByProduct(product).size());
        assertEquals(1, categoryRepository.findByProductAndActive(product, ActiveStatus.Y).size());
        assertTrue(categoryRepository.findByNameAndActive("Cat-A", ActiveStatus.Y).isPresent());
    }
}
