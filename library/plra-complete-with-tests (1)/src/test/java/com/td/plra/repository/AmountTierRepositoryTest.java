package com.td.plra.repository;

import com.td.plra.common.BaseRepositoryTest;
import com.td.plra.persistence.entity.AmountTier;
import com.td.plra.persistence.entity.Product;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.repository.AmountTierRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("AmountTierRepository Tests")
class AmountTierRepositoryTest extends BaseRepositoryTest {
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Autowired
    private AmountTierRepository repository;
    
    private Product product;
    private AmountTier amountTier;
    
    @BeforeEach
    void setUp() {
        product = new Product();
        product.setName("Test Product");
        product.setType("HELOC");
        product.setActive(ActiveStatus.Y);
        product = entityManager.persistAndFlush(product);
        
        amountTier = new AmountTier();
        amountTier.setName("Tier 1 (0-50K)");
        amountTier.setDetail("Amount from 0 to 50,000");
        amountTier.setMin(BigDecimal.ZERO);
        amountTier.setMax(new BigDecimal("50000"));
        amountTier.setProduct(product);
        amountTier.setActive(ActiveStatus.Y);
    }
    
    @Nested
    @DisplayName("findByActive")
    class FindByActive {
        
        @Test
        @DisplayName("Should find all active amount tiers")
        void shouldFindAllActiveAmountTiers() {
            // Given
            entityManager.persistAndFlush(amountTier);
            
            // When
            List<AmountTier> result = repository.findByActive(ActiveStatus.Y);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("findByProduct")
    class FindByProduct {
        
        @Test
        @DisplayName("Should find amount tiers by product")
        void shouldFindAmountTiersByProduct() {
            // Given
            entityManager.persistAndFlush(amountTier);
            
            // When
            List<AmountTier> result = repository.findByProduct(product);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("findByProductAndActive")
    class FindByProductAndActive {
        
        @Test
        @DisplayName("Should find active amount tiers by product")
        void shouldFindActiveAmountTiersByProduct() {
            // Given
            entityManager.persistAndFlush(amountTier);
            
            AmountTier inactiveTier = new AmountTier();
            inactiveTier.setName("Inactive Tier");
            inactiveTier.setMin(BigDecimal.ZERO);
            inactiveTier.setMax(new BigDecimal("10000"));
            inactiveTier.setProduct(product);
            inactiveTier.setActive(ActiveStatus.N);
            entityManager.persistAndFlush(inactiveTier);
            
            // When
            List<AmountTier> result = repository.findByProductAndActive(product, ActiveStatus.Y);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("findByNameAndProduct")
    class FindByNameAndProduct {
        
        @Test
        @DisplayName("Should find amount tier by name and product")
        void shouldFindAmountTierByNameAndProduct() {
            // Given
            entityManager.persistAndFlush(amountTier);
            
            // When
            Optional<AmountTier> result = repository.findByNameAndProduct("Tier 1 (0-50K)", product);
            
            // Then
            assertThat(result).isPresent();
            assertThat(result.get().getName()).isEqualTo("Tier 1 (0-50K)");
        }
    }
    
    @Nested
    @DisplayName("findByName")
    class FindByName {
        
        @Test
        @DisplayName("Should find amount tiers by name")
        void shouldFindAmountTiersByName() {
            // Given
            entityManager.persistAndFlush(amountTier);
            
            // When
            List<AmountTier> result = repository.findByName("Tier 1 (0-50K)");
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
}
