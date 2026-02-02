package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.AmountTier;
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

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
@DisplayName("AmountTierRepository Integration Tests")
class AmountTierRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private AmountTierRepository repository;

    private Product product;

    @BeforeEach
    void setUp() {
        product = new Product();
        product.setName("Test Product");
        product.setType("LENDING");
        product.setActive(ActiveStatus.Y);
        product.setCreatedBy("test-user");
        product.setUpdatedBy("test-user");
        entityManager.persist(product);
        entityManager.flush();
    }

    private AmountTier newTier(String name, ActiveStatus active, BigDecimal min, BigDecimal max) {
        AmountTier t = new AmountTier();
        t.setName(name);
        t.setMin(min);
        t.setMax(max);
        t.setProduct(product);
        t.setActive(active);
        t.setCreatedBy("test-user");
        t.setUpdatedBy("test-user");
        return t;
    }

    @Nested
    class FindOperations {

        @Test
        void shouldFindByProductAndActive() {
            entityManager.persistAndFlush(newTier("Tier 1", ActiveStatus.Y, new BigDecimal("0"), new BigDecimal("100")));
            entityManager.persistAndFlush(newTier("Tier 2", ActiveStatus.N, new BigDecimal("101"), new BigDecimal("200")));

            List<AmountTier> all = repository.findByProduct(product);
            List<AmountTier> active = repository.findByProductAndActive(product, ActiveStatus.Y);

            assertThat(all).hasSize(2);
            assertThat(active).hasSize(1);
            assertThat(active.get(0).getName()).isEqualTo("Tier 1");
        }

        @Test
        void shouldFindByActive() {
            entityManager.persistAndFlush(newTier("Tier 1", ActiveStatus.Y, new BigDecimal("0"), new BigDecimal("100")));
            entityManager.persistAndFlush(newTier("Tier 2", ActiveStatus.N, new BigDecimal("101"), new BigDecimal("200")));

            assertThat(repository.findByActive(ActiveStatus.Y)).hasSize(1);
            assertThat(repository.findByActive(ActiveStatus.N)).hasSize(1);
        }

        @Test
        void shouldFindByNameAndProduct() {
            AmountTier saved = entityManager.persistAndFlush(newTier("Tier X", ActiveStatus.Y, new BigDecimal("0"), new BigDecimal("999")));

            Optional<AmountTier> found = repository.findByNameAndProduct("Tier X", product);
            assertThat(found).isPresent();
            assertThat(found.get().getId()).isEqualTo(saved.getId());
        }

        @Test
        void shouldFindByNameAcrossProducts() {
            entityManager.persistAndFlush(newTier("Shared", ActiveStatus.Y, new BigDecimal("0"), new BigDecimal("100")));

            Product other = new Product();
            other.setName("Other Product");
            other.setType("LENDING");
            other.setActive(ActiveStatus.Y);
            other.setCreatedBy("test-user");
            other.setUpdatedBy("test-user");
            entityManager.persist(other);

            AmountTier otherTier = new AmountTier();
            otherTier.setName("Shared");
            otherTier.setMin(new BigDecimal("100"));
            otherTier.setMax(new BigDecimal("200"));
            otherTier.setProduct(other);
            otherTier.setActive(ActiveStatus.Y);
            otherTier.setCreatedBy("test-user");
            otherTier.setUpdatedBy("test-user");
            entityManager.persistAndFlush(otherTier);

            assertThat(repository.findByName("Shared")).hasSize(2);
        }
    }
}
