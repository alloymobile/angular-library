package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.Prime;
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
class PrimeRepositoryTest {

    @Autowired private PrimeRepository repository;

    @Test
    void findFirstByActiveOrderByCreatedOnDesc_returnsLatestActive() {
        Prime p1 = new Prime();
        p1.setRate(new BigDecimal("6.250000"));
        p1.setDetail("old");
        p1.setActive(ActiveStatus.Y);

        Prime p2 = new Prime();
        p2.setRate(new BigDecimal("6.500000"));
        p2.setDetail("new");
        p2.setActive(ActiveStatus.Y);

        repository.save(p1);
        repository.save(p2);

        Prime latest = repository.findFirstByActiveOrderByCreatedOnDesc(ActiveStatus.Y).orElseThrow();
        assertEquals("new", latest.getDetail());
    }
}
