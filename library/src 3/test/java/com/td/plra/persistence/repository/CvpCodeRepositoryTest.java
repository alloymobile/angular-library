package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.Category;
import com.td.plra.persistence.entity.CvpCode;
import com.td.plra.persistence.entity.Product;
import com.td.plra.persistence.entity.SubCategory;
import com.td.plra.persistence.enums.ActiveStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
@DisplayName("CvpCodeRepository Integration Tests")
class CvpCodeRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private CvpCodeRepository repository;

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

        entityManager.flush();
    }

    private CvpCode newCvp(String name, ActiveStatus active) {
        CvpCode code = new CvpCode();
        code.setName(name);
        code.setDetail("cvp detail");
        code.setSubCategory(subCategory);
        code.setActive(active);
        code.setCreatedBy("test-user");
        code.setUpdatedBy("test-user");
        return code;
    }

    @Nested
    class FindOperations {

        @Test
        void shouldFindByName() {
            CvpCode saved = entityManager.persistAndFlush(newCvp("CVP001", ActiveStatus.Y));
            Optional<CvpCode> found = repository.findByName("CVP001");
            assertThat(found).isPresent();
            assertThat(found.get().getId()).isEqualTo(saved.getId());
        }

        @Test
        void shouldFindByNameAndActive() {
            entityManager.persistAndFlush(newCvp("CVP_ACTIVE", ActiveStatus.Y));
            entityManager.persistAndFlush(newCvp("CVP_INACTIVE", ActiveStatus.N));

            assertThat(repository.findByNameAndActive("CVP_ACTIVE", ActiveStatus.Y)).isPresent();
            assertThat(repository.findByNameAndActive("CVP_ACTIVE", ActiveStatus.N)).isEmpty();
        }

        @Test
        void shouldFindBySubCategoryAndActive() {
            entityManager.persistAndFlush(newCvp("CVP1", ActiveStatus.Y));
            entityManager.persistAndFlush(newCvp("CVP2", ActiveStatus.N));

            List<CvpCode> all = repository.findBySubCategory(subCategory);
            List<CvpCode> active = repository.findBySubCategoryAndActive(subCategory, ActiveStatus.Y);

            assertThat(all).hasSize(2);
            assertThat(active).hasSize(1);
            assertThat(active.get(0).getActive()).isEqualTo(ActiveStatus.Y);
        }

        @Test
        void shouldFindByActive() {
            entityManager.persistAndFlush(newCvp("CVP1", ActiveStatus.Y));
            entityManager.persistAndFlush(newCvp("CVP2", ActiveStatus.N));

            assertThat(repository.findByActive(ActiveStatus.Y)).hasSize(1);
            assertThat(repository.findByActive(ActiveStatus.N)).hasSize(1);
        }
    }

    @Nested
    class ExistsOperations {
        @Test
        void shouldCheckExistsByName() {
            entityManager.persistAndFlush(newCvp("UNIQUE", ActiveStatus.Y));
            assertThat(repository.existsByName("UNIQUE")).isTrue();
            assertThat(repository.existsByName("MISSING")).isFalse();
        }
    }
}
