package com.td.plra.repository;

import com.td.plra.common.BaseRepositoryTest;
import com.td.plra.persistence.entity.Prime;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.repository.PrimeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("PrimeRepository Tests")
class PrimeRepositoryTest extends BaseRepositoryTest {
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Autowired
    private PrimeRepository repository;
    
    private Prime prime;
    
    @BeforeEach
    void setUp() {
        prime = new Prime();
        prime.setRate(new BigDecimal("7.25"));
        prime.setEffectiveDate(LocalDate.of(2024, 1, 1));
        prime.setDetail("Prime rate effective Jan 2024");
        prime.setActive(ActiveStatus.Y);
    }
    
    @Nested
    @DisplayName("findByActive")
    class FindByActive {
        
        @Test
        @DisplayName("Should find all active prime rates")
        void shouldFindAllActivePrimeRates() {
            // Given
            entityManager.persistAndFlush(prime);
            
            // When
            List<Prime> result = repository.findByActive(ActiveStatus.Y);
            
            // Then
            assertThat(result).hasSize(1);
            assertThat(result.get(0).getRate()).isEqualByComparingTo("7.25");
        }
    }
    
    @Nested
    @DisplayName("findFirstByActiveOrderByCreatedOnDesc")
    class FindFirstByActiveOrderByCreatedOnDesc {
        
        @Test
        @DisplayName("Should find most recent active prime rate")
        void shouldFindMostRecentActivePrimeRate() {
            // Given
            entityManager.persistAndFlush(prime);
            
            Prime newerPrime = new Prime();
            newerPrime.setRate(new BigDecimal("7.50"));
            newerPrime.setEffectiveDate(LocalDate.of(2024, 6, 1));
            newerPrime.setDetail("Prime rate effective Jun 2024");
            newerPrime.setActive(ActiveStatus.Y);
            entityManager.persistAndFlush(newerPrime);
            
            // When
            Optional<Prime> result = repository.findFirstByActiveOrderByCreatedOnDesc(ActiveStatus.Y);
            
            // Then
            assertThat(result).isPresent();
            // The most recently created should be returned
            assertThat(result.get().getRate()).isEqualByComparingTo("7.50");
        }
        
        @Test
        @DisplayName("Should return empty when no active prime rates")
        void shouldReturnEmptyWhenNoActivePrimeRates() {
            // Given
            prime.setActive(ActiveStatus.N);
            entityManager.persistAndFlush(prime);
            
            // When
            Optional<Prime> result = repository.findFirstByActiveOrderByCreatedOnDesc(ActiveStatus.Y);
            
            // Then
            assertThat(result).isEmpty();
        }
    }
    
    @Nested
    @DisplayName("CRUD Operations")
    class CrudOperations {
        
        @Test
        @DisplayName("Should save and retrieve prime rate")
        void shouldSaveAndRetrievePrimeRate() {
            // Given & When
            Prime saved = repository.save(prime);
            entityManager.flush();
            entityManager.clear();
            
            // Then
            Optional<Prime> found = repository.findById(saved.getId());
            assertThat(found).isPresent();
            assertThat(found.get().getRate()).isEqualByComparingTo("7.25");
        }
    }
}
