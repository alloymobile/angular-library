package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.Category;
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
@DisplayName("SubCategoryRepository Integration Tests")
class SubCategoryRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private SubCategoryRepository repository;

    private Category category;

    @BeforeEach
    void setUp() {
        Product product = new Product();
        product.setName("Test Product");
        product.setType("LENDING");
        product.setActive(ActiveStatus.Y);
        product.setCreatedBy("test-user");
        product.setUpdatedBy("test-user");
        entityManager.persist(product);

        category = new Category();
        category.setName("Test Category");
        category.setProduct(product);
        category.setActive(ActiveStatus.Y);
        category.setCreatedBy("test-user");
        category.setUpdatedBy("test-user");
        entityManager.persist(category);

        entityManager.flush();
    }

    private SubCategory newSubCategory(String name, ActiveStatus active) {
        SubCategory sc = new SubCategory();
        sc.setName(name);
        sc.setDetail("sc detail");
        sc.setCategory(category);
        sc.setActive(active);
        sc.setCreatedBy("test-user");
        sc.setUpdatedBy("test-user");
        return sc;
    }

    @Nested
    class FindOperations {

        @Test
        void shouldFindByName() {
            SubCategory saved = entityManager.persistAndFlush(newSubCategory("SC A", ActiveStatus.Y));
            Optional<SubCategory> found = repository.findByName("SC A");
            assertThat(found).isPresent();
            assertThat(found.get().getId()).isEqualTo(saved.getId());
        }

        @Test
        void shouldFindByCategoryAndActive() {
            entityManager.persistAndFlush(newSubCategory("SC 1", ActiveStatus.Y));
            entityManager.persistAndFlush(newSubCategory("SC 2", ActiveStatus.N));

            List<SubCategory> all = repository.findByCategory(category);
            List<SubCategory> active = repository.findByCategoryAndActive(category, ActiveStatus.Y);

            assertThat(all).hasSize(2);
            assertThat(active).hasSize(1);
            assertThat(active.get(0).getActive()).isEqualTo(ActiveStatus.Y);
        }

        @Test
        void shouldFindByNameAndActive() {
            entityManager.persistAndFlush(newSubCategory("SC Active", ActiveStatus.Y));
            entityManager.persistAndFlush(newSubCategory("SC Inactive", ActiveStatus.N));

            assertThat(repository.findByNameAndActive("SC Active", ActiveStatus.Y)).isPresent();
            assertThat(repository.findByNameAndActive("SC Active", ActiveStatus.N)).isEmpty();
        }

        @Test
        void shouldFindByActive() {
            entityManager.persistAndFlush(newSubCategory("SC 1", ActiveStatus.Y));
            entityManager.persistAndFlush(newSubCategory("SC 2", ActiveStatus.N));

            assertThat(repository.findByActive(ActiveStatus.Y)).hasSize(1);
            assertThat(repository.findByActive(ActiveStatus.N)).hasSize(1);
        }
    }

    @Nested
    class ExistsOperations {
        @Test
        void shouldCheckExistsByName() {
            entityManager.persistAndFlush(newSubCategory("Unique SC", ActiveStatus.Y));
            assertThat(repository.existsByName("Unique SC")).isTrue();
            assertThat(repository.existsByName("Missing")).isFalse();
        }
    }
}
