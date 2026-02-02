package com.td.plra.service;

import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.common.BaseServiceTest;
import com.td.plra.common.TestEntityFactory;
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

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
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
        prime = TestEntityFactory.createPrime();
        input = TestEntityFactory.createPrimeInput();
        adminView = TestEntityFactory.createPrimeAdminView();
    }
    
    @Nested
    @DisplayName("Create Prime")
    class CreatePrime {
        
        @Test
        @DisplayName("Should create prime rate successfully")
        void shouldCreatePrimeRateSuccessfully() {
            // Given
            when(mapper.toEntity(input)).thenReturn(prime);
            when(repository.save(any(Prime.class))).thenReturn(prime);
            when(mapper.toAdminView(prime)).thenReturn(adminView);
            
            // When
            PrimeAdminView result = service.create(input);
            
            // Then
            assertThat(result).isNotNull();
            verify(repository).save(any(Prime.class));
        }
    }
    
    @Nested
    @DisplayName("Find Prime By ID")
    class FindById {
        
        @Test
        @DisplayName("Should find prime rate by ID")
        void shouldFindPrimeRateById() {
            // Given
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(prime));
            when(mapper.toAdminView(prime)).thenReturn(adminView);
            
            // When
            PrimeAdminView result = service.findById(TEST_ID);
            
            // Then
            assertThat(result).isNotNull();
        }
        
        @Test
        @DisplayName("Should throw exception when not found")
        void shouldThrowExceptionWhenNotFound() {
            // Given
            when(repository.findById(TEST_ID)).thenReturn(Optional.empty());
            
            // When/Then
            assertThatThrownBy(() -> service.findById(TEST_ID))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }
    
    @Nested
    @DisplayName("Find All Primes")
    class FindAll {
        
        @Test
        @DisplayName("Should find all prime rates with pagination")
        void shouldFindAllPrimeRatesWithPagination() {
            // Given
            Page<Prime> page = new PageImpl<>(List.of(prime), defaultPageable, 1);
            when(binding.buildPredicate(emptyParams)).thenReturn(null);
            when(repository.findAll(defaultPageable)).thenReturn(page);
            when(mapper.toAdminViewList(anyList())).thenReturn(List.of(adminView));
            
            // When
            PageResponse<PrimeAdminView> result = service.findAll(emptyParams, defaultPageable);
            
            // Then
            assertThat(result).isNotNull();
            assertThat(result.getContent()).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("Find Current Prime")
    class FindCurrentPrime {
        
        @Test
        @DisplayName("Should find current active prime rate")
        void shouldFindCurrentActivePrimeRate() {
            // Given
            when(repository.findFirstByActiveOrderByCreatedOnDesc(ActiveStatus.Y))
                    .thenReturn(Optional.of(prime));
            when(mapper.toAdminView(prime)).thenReturn(adminView);
            
            // When
            PrimeAdminView result = service.findCurrentPrime();
            
            // Then
            assertThat(result).isNotNull();
        }
        
        @Test
        @DisplayName("Should throw exception when no current prime")
        void shouldThrowExceptionWhenNoCurrentPrime() {
            // Given
            when(repository.findFirstByActiveOrderByCreatedOnDesc(ActiveStatus.Y))
                    .thenReturn(Optional.empty());
            
            // When/Then
            assertThatThrownBy(() -> service.findCurrentPrime())
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }
    
    @Nested
    @DisplayName("Delete Prime")
    class DeletePrime {
        
        @Test
        @DisplayName("Should soft delete prime rate")
        void shouldSoftDeletePrimeRate() {
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
}
