package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.Category;
import com.td.plra.persistence.entity.CvpCode;
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
class CvpCodeRepositoryTest {

    @Autowired private ProductRepository productRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private SubCategoryRepository subCategoryRepository;
    @Autowired private CvpCodeRepository cvpCodeRepository;

    @Test
    void cvpCode_queries_work() {
        Product product = new Product();
        product.setName("ULOC");
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

        SubCategory sub = new SubCategory();
        sub.setName("Sub-A");
        sub.setDetail("A");
        sub.setActive(ActiveStatus.Y);
        sub.setCategory(category);
        sub = subCategoryRepository.save(sub);

        CvpCode c1 = new CvpCode();
        c1.setName("CVP1");
        c1.setDetail("d1");
        c1.setActive(ActiveStatus.Y);
        c1.setSubCategory(sub);

        CvpCode c2 = new CvpCode();
        c2.setName("CVP2");
        c2.setDetail("d2");
        c2.setActive(ActiveStatus.N);
        c2.setSubCategory(sub);

        cvpCodeRepository.save(c1);
        cvpCodeRepository.save(c2);

        assertTrue(cvpCodeRepository.findByName("CVP1").isPresent());
        assertTrue(cvpCodeRepository.existsByName("CVP2"));
        assertEquals(1, cvpCodeRepository.findByActive(ActiveStatus.Y).size());
        assertEquals(2, cvpCodeRepository.findBySubCategory(sub).size());
        assertEquals(1, cvpCodeRepository.findBySubCategoryAndActive(sub, ActiveStatus.Y).size());
        assertTrue(cvpCodeRepository.findByNameAndActive("CVP1", ActiveStatus.Y).isPresent());
    }
}
