package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.Category;
import com.td.plra.persistence.entity.Product;
import com.td.plra.persistence.entity.SubCategory;
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
class SubCategoryRepositoryTest {

    @Autowired private ProductRepository productRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private SubCategoryRepository subCategoryRepository;

    @Test
    void subCategory_queries_work() {
        Product product = new Product();
        product.setName("ILOC");
        product.setType("LOAN");
        product.setSecurityCode("SEC");
        product.setDetail("d");
        product.setActive(ActiveStatus.Y);
        product = productRepository.save(product);

        Category category = new Category();
        category.setName("Cat-A");
        category.setDetail("A");
        category.setActive(ActiveStatus.Y);
        category.setProduct(product);
        category = categoryRepository.save(category);

        SubCategory s1 = new SubCategory();
        s1.setName("Sub-A");
        s1.setDetail("A");
        s1.setActive(ActiveStatus.Y);
        s1.setCategory(category);

        SubCategory s2 = new SubCategory();
        s2.setName("Sub-B");
        s2.setDetail("B");
        s2.setActive(ActiveStatus.N);
        s2.setCategory(category);

        subCategoryRepository.save(s1);
        subCategoryRepository.save(s2);

        assertTrue(subCategoryRepository.findByName("Sub-A").isPresent());
        assertTrue(subCategoryRepository.existsByName("Sub-B"));

        assertEquals(1, subCategoryRepository.findByActive(ActiveStatus.Y).size());
        assertEquals(2, subCategoryRepository.findByCategory(category).size());
        assertEquals(1, subCategoryRepository.findByCategoryAndActive(category, ActiveStatus.Y).size());
        assertTrue(subCategoryRepository.findByNameAndActive("Sub-A", ActiveStatus.Y).isPresent());
    }
}
