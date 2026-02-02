package com.td.plra.service;

import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.common.BaseServiceTest;
import com.td.plra.common.TestFixtures;
import com.td.plra.persistence.entity.Prime;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.repository.PrimeRepository;
import com.td.plra.service.prime.PrimeService;
import com.td.plra.service.prime.binding.PrimeBinding;
import com.td.plra.service.prime.dto.PrimeAdminView;
import com.td.plra.service.prime.dto.PrimeInput;
import com.td.plra.service.prime.mapper.PrimeMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@DisplayName("PrimeService Tests")
class PrimeServiceTest extends BaseServiceTest {
    
    @Mock
    private PrimeRepository repository;
    
    @Mock
    private PrimeMapper mapper;
    
    @Mock
    private PrimeBinding binding;
    
    @InjectMocks
    private PrimeService service;
    
    private Prime prime;
    private PrimeInput input;
    private PrimeAdminView adminView;
    
    @BeforeEach
    void setUp() {
        prime = TestFixtures.createPrime();
        input = TestFixtures.createPrimeInput();
        adminView = TestFixtures.createPrimeAdminView();
    }
    
    @Nested
    @DisplayName("Create Prime")
    class CreatePrime {
        
        @Test
        @DisplayName("Should create prime rate successfully")
        void shouldCreatePrimeRateSuccessfully() {
            // Given
            when(mapper.toEntity(any(PrimeInput.class))).thenReturn(prime);
            when(repository.save(any(Prime.class))).thenReturn(prime);
            when(mapper.toAdminView(any(Prime.class))).thenReturn(adminView);
            
            // When
            PrimeAdminView result = service.create(input);
            
            // Then
            assertThat(result).isNotNull();
            assertThat(result.getRate()).isEqualTo(input.getRate());
            verify(repository).save(any(Prime.class));
        }
    }
    
    @Nested
    @DisplayName("Find Prime By ID")
    class FindById {
        
        @Test
        @DisplayName("Should find prime rate by ID successfully")
        void shouldFindPrimeByIdSuccessfully() {
            // Given
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(prime));
            when(mapper.toAdminView(prime)).thenReturn(adminView);
            
            // When
            PrimeAdminView result = service.findById(TEST_ID);
            
            // Then
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(TEST_ID);
        }
        
        @Test
        @DisplayName("Should throw exception when prime rate not found")
        void shouldThrowExceptionWhenNotFound() {
            // Given
            when(repository.findById(INVALID_ID)).thenReturn(Optional.empty());
            
            // When/Then
            assertThatThrownBy(() -> service.findById(INVALID_ID))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessageContaining("Prime");
        }
    }
    
    @Nested
    @DisplayName("Get Current Prime")
    class GetCurrentPrime {
        
        @Test
        @DisplayName("Should return current active prime rate")
        void shouldReturnCurrentActivePrimeRate() {
            // Given
            when(repository.findFirstByActiveOrderByCreatedOnDesc(ActiveStatus.Y))
                    .thenReturn(Optional.of(prime));
            when(mapper.toAdminView(prime)).thenReturn(adminView);
            
            // When
            Optional<PrimeAdminView> result = service.getCurrentPrime();
            
            // Then
            assertThat(result).isPresent();
            assertThat(result.get().getRate()).isEqualTo(prime.getRate());
        }
        
        @Test
        @DisplayName("Should return empty when no active prime rate")
        void shouldReturnEmptyWhenNoActivePrimeRate() {
            // Given
            when(repository.findFirstByActiveOrderByCreatedOnDesc(ActiveStatus.Y))
                    .thenReturn(Optional.empty());
            
            // When
            Optional<PrimeAdminView> result = service.getCurrentPrime();
            
            // Then
            assertThat(result).isEmpty();
        }
    }
    
    @Nested
    @DisplayName("Find All Primes")
    class FindAll {
        
        @Test
        @DisplayName("Should find all prime rates with pagination")
        void shouldFindAllPrimeRatesWithPagination() {
            // Given
            Page<Prime> primePage = new PageImpl<>(List.of(prime), defaultPageable, 1);
            when(binding.buildPredicate(any())).thenReturn(null);
            when(repository.findAll(defaultPageable)).thenReturn(primePage);
            when(mapper.toAdminViewList(anyList())).thenReturn(List.of(adminView));
            
            // When
            PageResponse<PrimeAdminView> result = service.findAll(emptyParams, defaultPageable);
            
            // Then
            assertThat(result).isNotNull();
            assertThat(result.getContent()).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("Update Prime")
    class UpdatePrime {
        
        @Test
        @DisplayName("Should update prime rate successfully")
        void shouldUpdatePrimeRateSuccessfully() {
            // Given
            PrimeInput updateInput = PrimeInput.builder()
                    .rate(new BigDecimal("5.50"))
                    .detail("Updated prime rate")
                    .build();
            
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(prime));
            when(repository.save(any(Prime.class))).thenReturn(prime);
            when(mapper.toAdminView(any(Prime.class))).thenReturn(adminView);
            
            // When
            PrimeAdminView result = service.update(TEST_ID, updateInput);
            
            // Then
            assertThat(result).isNotNull();
            verify(mapper).updateEntity(updateInput, prime);
            verify(repository).save(prime);
        }
        
        @Test
        @DisplayName("Should throw exception when prime rate not found")
        void shouldThrowExceptionWhenPrimeRateNotFound() {
            // Given
            when(repository.findById(INVALID_ID)).thenReturn(Optional.empty());
            
            // When/Then
            assertThatThrownBy(() -> service.update(INVALID_ID, input))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }
    
    @Nested
    @DisplayName("Delete Prime")
    class DeletePrime {
        
        @Test
        @DisplayName("Should soft delete prime rate successfully")
        void shouldSoftDeletePrimeRateSuccessfully() {
            // Given
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(prime));
            when(repository.save(any(Prime.class))).thenReturn(prime);
            
            // When
            service.delete(TEST_ID);
            
            // Then
            assertThat(prime.getActive()).isEqualTo(ActiveStatus.N);
            verify(repository).save(prime);
        }
    }
    
    @Nested
    @DisplayName("Reactivate Prime")
    class ReactivatePrime {
        
        @Test
        @DisplayName("Should reactivate prime rate successfully")
        void shouldReactivatePrimeRateSuccessfully() {
            // Given
            prime.setActive(ActiveStatus.N);
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(prime));
            when(repository.save(any(Prime.class))).thenReturn(prime);
            when(mapper.toAdminView(any(Prime.class))).thenReturn(adminView);
            
            // When
            PrimeAdminView result = service.reactivate(TEST_ID);
            
            // Then
            assertThat(prime.getActive()).isEqualTo(ActiveStatus.Y);
            verify(repository).save(prime);
        }
    }
}
