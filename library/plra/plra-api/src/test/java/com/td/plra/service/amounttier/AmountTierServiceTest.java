package com.td.plra.service.amounttier;

import com.td.plra.application.exception.BadRequestException;
import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.persistence.entity.AmountTier;
import com.td.plra.persistence.entity.Product;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.repository.AmountTierRepository;
import com.td.plra.service.amounttier.binding.AmountTierBinding;
import com.td.plra.service.amounttier.dto.AmountTierAdminView;
import com.td.plra.service.amounttier.dto.AmountTierInput;
import com.td.plra.service.amounttier.mapper.AmountTierMapper;
import com.td.plra.testutil.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AmountTierServiceTest {

    @Mock private AmountTierRepository repository;
    @Mock private AmountTierMapper mapper;
    @Mock private AmountTierBinding binding;
    @InjectMocks private AmountTierService service;

    private AmountTier entity;
    private Product product;
    private AmountTierInput input;
    private AmountTierAdminView adminView;

    @BeforeEach
    void setUp() {
        product = TestDataFactory.product();
        entity = TestDataFactory.amountTier();
        input = TestDataFactory.amountTierInput();
        adminView = AmountTierAdminView.builder().id(300L).name("Tier 1")
                .min(BigDecimal.ZERO).max(new BigDecimal("50000.00")).active(true).build();
    }

    @Nested @DisplayName("Create")
    class CreateTests {
        @Test @DisplayName("Should create amount tier with product FK")
        void createSuccess() {
            when(mapper.toEntity(any(AmountTierInput.class))).thenReturn(entity);
            when(repository.save(any())).thenReturn(entity);
            when(mapper.toAdminView(any(AmountTier.class))).thenReturn(adminView);

            AmountTierAdminView result = service.create(input, product);
            assertThat(result).isNotNull();
            assertThat(entity.getProduct()).isEqualTo(product);
            verify(repository).save(any(AmountTier.class));
        }

        @Test @DisplayName("Should reject min > max (CHK_AMOUNT_TIER_RANGE)")
        void createMinGreaterThanMax() {
            AmountTierInput bad = TestDataFactory.amountTierInput();
            bad.setMin(new BigDecimal("100000.00"));
            bad.setMax(new BigDecimal("50000.00"));

            assertThatThrownBy(() -> service.create(bad, product))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("Minimum");
            verify(repository, never()).save(any());
        }

        @Test @DisplayName("Should allow min == max (boundary)")
        void createMinEqualsMax() {
            AmountTierInput equal = TestDataFactory.amountTierInput();
            equal.setMin(new BigDecimal("50000.00"));
            equal.setMax(new BigDecimal("50000.00"));
            when(mapper.toEntity(any())).thenReturn(entity);
            when(repository.save(any())).thenReturn(entity);
            when(mapper.toAdminView(any())).thenReturn(adminView);

            AmountTierAdminView result = service.create(equal, product);
            assertThat(result).isNotNull();
        }
    }

    @Nested @DisplayName("Read")
    class ReadTests {
        @Test @DisplayName("Should find by ID")
        void findByIdSuccess() {
            when(repository.findById(300L)).thenReturn(Optional.of(entity));
            when(mapper.toAdminView(entity)).thenReturn(adminView);
            assertThat(service.findById(300L)).isNotNull();
        }

        @Test @DisplayName("Should throw when not found by ID")
        void findByIdNotFound() {
            when(repository.findById(999L)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> service.findById(999L))
                    .isInstanceOf(EntityNotFoundException.class);
        }

        @Test @DisplayName("Should find all paginated")
        void findAllSuccess() {
            Page<AmountTier> page = new PageImpl<>(List.of(entity));
            when(binding.buildPredicate(any())).thenReturn(null);
            when(repository.findAll(any(PageRequest.class))).thenReturn(page);
            when(mapper.toAdminViewList(any())).thenReturn(List.of(adminView));

            var result = service.findAll(new HashMap<>(), PageRequest.of(0, 20));
            assertThat(result.getContent()).hasSize(1);
        }
    }

    @Nested @DisplayName("Update")
    class UpdateTests {
        @Test @DisplayName("Should update with valid min/max")
        void updateSuccess() {
            when(repository.findById(300L)).thenReturn(Optional.of(entity));
            when(repository.save(any())).thenReturn(entity);
            when(mapper.toAdminView(any())).thenReturn(adminView);

            service.update(300L, input, product);
            verify(mapper).updateEntity(any(AmountTierInput.class), any(AmountTier.class));
        }

        @Test @DisplayName("Should reject update with min > max (both provided)")
        void updateMinGreaterThanMax() {
            AmountTierInput bad = TestDataFactory.amountTierInput();
            bad.setMin(new BigDecimal("100000.00"));
            bad.setMax(new BigDecimal("50000.00"));
            when(repository.findById(300L)).thenReturn(Optional.of(entity));

            assertThatThrownBy(() -> service.update(300L, bad, product))
                    .isInstanceOf(BadRequestException.class);
        }

        @Test @DisplayName("Should reject update with new min > existing max (partial)")
        void updatePartialMinExceedsMax() {
            AmountTierInput partialMin = new AmountTierInput();
            partialMin.setMin(new BigDecimal("999999.00"));
            // max is null (partial update), existing max is 50000
            when(repository.findById(300L)).thenReturn(Optional.of(entity));

            assertThatThrownBy(() -> service.update(300L, partialMin, product))
                    .isInstanceOf(BadRequestException.class);
        }

        @Test @DisplayName("Should reject update with existing min > new max (partial)")
        void updatePartialMaxBelowMin() {
            AmountTierInput partialMax = new AmountTierInput();
            partialMax.setMax(new BigDecimal("-1.00"));
            // min is null (partial update), existing min is 0
            when(repository.findById(300L)).thenReturn(Optional.of(entity));

            assertThatThrownBy(() -> service.update(300L, partialMax, product))
                    .isInstanceOf(BadRequestException.class);
        }

        @Test @DisplayName("Should change product FK on update")
        void updateProductChange() {
            Product newProduct = TestDataFactory.product(2L, "Business Lending");
            when(repository.findById(300L)).thenReturn(Optional.of(entity));
            when(repository.save(any())).thenReturn(entity);
            when(mapper.toAdminView(any())).thenReturn(adminView);

            service.update(300L, input, newProduct);
            assertThat(entity.getProduct()).isEqualTo(newProduct);
        }

        @Test @DisplayName("Should throw when updating non-existent")
        void updateNotFound() {
            when(repository.findById(999L)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> service.update(999L, input, product))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }

    @Nested @DisplayName("Delete / Reactivate")
    class DeleteTests {
        @Test @DisplayName("Should soft delete")
        void deleteSuccess() {
            when(repository.findById(300L)).thenReturn(Optional.of(entity));
            when(repository.save(any())).thenReturn(entity);
            service.delete(300L);
            assertThat(entity.getActive()).isEqualTo(ActiveStatus.N);
        }

        @Test @DisplayName("Should throw when deleting non-existent")
        void deleteNotFound() {
            when(repository.findById(999L)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> service.delete(999L))
                    .isInstanceOf(EntityNotFoundException.class);
        }

        @Test @DisplayName("Should reactivate")
        void reactivateSuccess() {
            entity.setActive(ActiveStatus.N);
            when(repository.findById(300L)).thenReturn(Optional.of(entity));
            when(repository.save(any())).thenReturn(entity);
            when(mapper.toAdminView(any())).thenReturn(adminView);
            service.reactivate(300L);
            assertThat(entity.getActive()).isEqualTo(ActiveStatus.Y);
        }
    }

    @Nested @DisplayName("Internal Accessors")
    class InternalTests {
        @Test @DisplayName("Should check existsById")
        void existsById() {
            when(repository.existsById(300L)).thenReturn(true);
            assertThat(service.existsById(300L)).isTrue();
        }

        @Test @DisplayName("Should return false for existsById")
        void existsByIdFalse() {
            when(repository.existsById(999L)).thenReturn(false);
            assertThat(service.existsById(999L)).isFalse();
        }

        @Test @DisplayName("Should get entity by ID")
        void getById() {
            when(repository.findById(300L)).thenReturn(Optional.of(entity));
            assertThat(service.getEntityById(300L)).isNotNull();
        }

        @Test @DisplayName("Should throw not found")
        void notFound() {
            when(repository.findById(999L)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> service.getEntityById(999L))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }
}
