package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.Category;
import com.td.plra.persistence.entity.Product;
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
@DisplayName("CategoryRepository Integration Tests")
class CategoryRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private CategoryRepository repository;

    private Product product;

    @BeforeEach
    void setUp() {
        product = new Product();
        product.setName("Test Product");
        product.setType("LENDING");
        product.setSecurityCode("SEC001");
        product.setDetail("detail");
        product.setActive(ActiveStatus.Y);
        product.setCreatedBy("test-user");
        product.setUpdatedBy("test-user");
        entityManager.persist(product);
        entityManager.flush();
    }

    private Category newCategory(String name, ActiveStatus active) {
        Category c = new Category();
        c.setName(name);
        c.setDetail("cat detail");
        c.setProduct(product);
        c.setActive(active);
        c.setCreatedBy("test-user");
        c.setUpdatedBy("test-user");
        return c;
    }

    @Nested
    @DisplayName("Find Operations")
    class FindOperations {

        @Test
        void shouldFindByName() {
            Category saved = entityManager.persistAndFlush(newCategory("Cat A", ActiveStatus.Y));
            Optional<Category> found = repository.findByName("Cat A");
            assertThat(found).isPresent();
            assertThat(found.get().getId()).isEqualTo(saved.getId());
        }

        @Test
        void shouldFindByNameAndActive() {
            entityManager.persistAndFlush(newCategory("Cat Active", ActiveStatus.Y));
            entityManager.persistAndFlush(newCategory("Cat Inactive", ActiveStatus.N));

            assertThat(repository.findByNameAndActive("Cat Active", ActiveStatus.Y)).isPresent();
            assertThat(repository.findByNameAndActive("Cat Active", ActiveStatus.N)).isEmpty();
        }

        @Test
        void shouldFindByProductAndActive() {
            entityManager.persistAndFlush(newCategory("Cat 1", ActiveStatus.Y));
            entityManager.persistAndFlush(newCategory("Cat 2", ActiveStatus.N));

            List<Category> active = repository.findByProductAndActive(product, ActiveStatus.Y);
            List<Category> allForProduct = repository.findByProduct(product);

            assertThat(allForProduct).hasSize(2);
            assertThat(active).hasSize(1);
            assertThat(active.get(0).getActive()).isEqualTo(ActiveStatus.Y);
        }

        @Test
        void shouldFindByActive() {
            entityManager.persistAndFlush(newCategory("Cat 1", ActiveStatus.Y));
            entityManager.persistAndFlush(newCategory("Cat 2", ActiveStatus.N));

            assertThat(repository.findByActive(ActiveStatus.Y)).hasSize(1);
            assertThat(repository.findByActive(ActiveStatus.N)).hasSize(1);
        }
    }

    @Nested
    @DisplayName("Exists Operations")
    class ExistsOperations {

        @Test
        void shouldCheckExistsByName() {
            entityManager.persistAndFlush(newCategory("Unique Name", ActiveStatus.Y));

            assertThat(repository.existsByName("Unique Name")).isTrue();
            assertThat(repository.existsByName("Missing")).isFalse();
        }
    }
}
