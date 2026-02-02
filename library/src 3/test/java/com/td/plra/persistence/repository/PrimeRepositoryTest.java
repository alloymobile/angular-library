package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.Prime;
import com.td.plra.persistence.enums.ActiveStatus;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
@DisplayName("PrimeRepository Integration Tests")
class PrimeRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private PrimeRepository repository;

    private Prime newPrime(BigDecimal rate, ActiveStatus active, LocalDateTime createdOn) {
        Prime p = new Prime();
        p.setPrimeRate(rate);
        p.setStartDate(LocalDate.now().minusDays(1));
        p.setExpiryDate(LocalDate.now().plusYears(1));
        p.setActive(active);
        p.setCreatedBy("test-user");
        p.setUpdatedBy("test-user");
        p.setCreatedOn(createdOn);
        p.setUpdatedOn(createdOn);
        return p;
    }

    @Test
    void shouldFindByActive() {
        entityManager.persistAndFlush(newPrime(new BigDecimal("7.10"), ActiveStatus.Y, LocalDateTime.now().minusDays(2)));
        entityManager.persistAndFlush(newPrime(new BigDecimal("6.90"), ActiveStatus.N, LocalDateTime.now().minusDays(1)));

        assertThat(repository.findByActive(ActiveStatus.Y)).hasSize(1);
        assertThat(repository.findByActive(ActiveStatus.N)).hasSize(1);
    }

    @Test
    void shouldFindLatestActiveByCreatedOnDesc() {
        Prime older = newPrime(new BigDecimal("7.10"), ActiveStatus.Y, LocalDateTime.now().minusDays(2));
        Prime newer = newPrime(new BigDecimal("7.25"), ActiveStatus.Y, LocalDateTime.now().minusDays(1));

        entityManager.persistAndFlush(older);
        entityManager.persistAndFlush(newer);

        assertThat(repository.findFirstByActiveOrderByCreatedOnDesc(ActiveStatus.Y)).isPresent();
        assertThat(repository.findFirstByActiveOrderByCreatedOnDesc(ActiveStatus.Y).get().getPrimeRate())
                .isEqualByComparingTo(new BigDecimal("7.25"));
    }
}
