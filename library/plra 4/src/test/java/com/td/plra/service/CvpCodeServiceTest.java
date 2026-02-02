package com.td.plra.service;

import com.td.plra.application.exception.BadRequestException;
import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.common.BaseServiceTest;
import com.td.plra.common.TestFixtures;
import com.td.plra.persistence.entity.CvpCode;
import com.td.plra.persistence.entity.SubCategory;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.repository.CvpCodeRepository;
import com.td.plra.service.cvpcode.CvpCodeService;
import com.td.plra.service.cvpcode.binding.CvpCodeBinding;
import com.td.plra.service.cvpcode.dto.CvpCodeAdminView;
import com.td.plra.service.cvpcode.dto.CvpCodeInput;
import com.td.plra.service.cvpcode.mapper.CvpCodeMapper;
import com.td.plra.service.subcategory.SubCategoryService;
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
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@DisplayName("CvpCodeService Tests")
class CvpCodeServiceTest extends BaseServiceTest {
    
    @Mock
    private CvpCodeRepository repository;
    
    @Mock
    private CvpCodeMapper mapper;
    
    @Mock
    private CvpCodeBinding binding;
    
    @Mock
    private SubCategoryService subCategoryService;
    
    @InjectMocks
    private CvpCodeService service;
    
    private CvpCode cvpCode;
    private SubCategory subCategory;
    private CvpCodeInput input;
    private CvpCodeAdminView adminView;
    
    @BeforeEach
    void setUp() {
        subCategory = TestFixtures.createSubCategory();
        cvpCode = TestFixtures.createCvpCode();
        input = TestFixtures.createCvpCodeInput();
        adminView = TestFixtures.createCvpCodeAdminView();
    }
    
    @Nested
    @DisplayName("Create CVP Code")
    class CreateCvpCode {
        
        @Test
        @DisplayName("Should create CVP code successfully")
        void shouldCreateCvpCodeSuccessfully() {
            // Given
            when(repository.existsByName(anyString())).thenReturn(false);
            when(subCategoryService.getEntityById(anyLong())).thenReturn(subCategory);
            when(mapper.toEntity(any(CvpCodeInput.class))).thenReturn(cvpCode);
            when(repository.save(any(CvpCode.class))).thenReturn(cvpCode);
            when(mapper.toAdminView(any(CvpCode.class))).thenReturn(adminView);
            
            // When
            CvpCodeAdminView result = service.create(input);
            
            // Then
            assertThat(result).isNotNull();
            assertThat(result.getName()).isEqualTo(input.getName());
            verify(subCategoryService).getEntityById(input.getSubCategoryId());
            verify(repository).save(any(CvpCode.class));
        }
        
        @Test
        @DisplayName("Should throw exception when name already exists")
        void shouldThrowExceptionWhenNameExists() {
            // Given
            when(repository.existsByName(anyString())).thenReturn(true);
            
            // When/Then
            assertThatThrownBy(() -> service.create(input))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("already exists");
            
            verify(repository, never()).save(any(CvpCode.class));
        }
        
        @Test
        @DisplayName("Should throw exception when subcategory not found")
        void shouldThrowExceptionWhenSubCategoryNotFound() {
            // Given
            when(repository.existsByName(anyString())).thenReturn(false);
            when(subCategoryService.getEntityById(anyLong()))
                    .thenThrow(new EntityNotFoundException("SubCategory", input.getSubCategoryId()));
            
            // When/Then
            assertThatThrownBy(() -> service.create(input))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessageContaining("SubCategory");
        }
    }
    
    @Nested
    @DisplayName("Find CVP Code By ID")
    class FindById {
        
        @Test
        @DisplayName("Should find CVP code by ID successfully")
        void shouldFindCvpCodeByIdSuccessfully() {
            // Given
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(cvpCode));
            when(mapper.toAdminView(cvpCode)).thenReturn(adminView);
            
            // When
            CvpCodeAdminView result = service.findById(TEST_ID);
            
            // Then
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(TEST_ID);
        }
        
        @Test
        @DisplayName("Should throw exception when CVP code not found")
        void shouldThrowExceptionWhenNotFound() {
            // Given
            when(repository.findById(INVALID_ID)).thenReturn(Optional.empty());
            
            // When/Then
            assertThatThrownBy(() -> service.findById(INVALID_ID))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessageContaining("CvpCode");
        }
    }
    
    @Nested
    @DisplayName("Find All CVP Codes")
    class FindAll {
        
        @Test
        @DisplayName("Should find all CVP codes with pagination")
        void shouldFindAllCvpCodesWithPagination() {
            // Given
            Page<CvpCode> cvpCodePage = new PageImpl<>(List.of(cvpCode), defaultPageable, 1);
            when(binding.buildPredicate(any())).thenReturn(null);
            when(repository.findAll(defaultPageable)).thenReturn(cvpCodePage);
            when(mapper.toAdminViewList(anyList())).thenReturn(List.of(adminView));
            
            // When
            PageResponse<CvpCodeAdminView> result = service.findAll(emptyParams, defaultPageable);
            
            // Then
            assertThat(result).isNotNull();
            assertThat(result.getContent()).hasSize(1);
        }
        
        @Test
        @DisplayName("Should return empty page when no CVP codes found")
        void shouldReturnEmptyPageWhenNoCvpCodesFound() {
            // Given
            Page<CvpCode> emptyPage = new PageImpl<>(List.of(), defaultPageable, 0);
            when(binding.buildPredicate(any())).thenReturn(null);
            when(repository.findAll(defaultPageable)).thenReturn(emptyPage);
            when(mapper.toAdminViewList(anyList())).thenReturn(List.of());
            
            // When
            PageResponse<CvpCodeAdminView> result = service.findAll(emptyParams, defaultPageable);
            
            // Then
            assertThat(result).isNotNull();
            assertThat(result.getContent()).isEmpty();
            assertThat(result.isEmpty()).isTrue();
        }
    }
    
    @Nested
    @DisplayName("Update CVP Code")
    class UpdateCvpCode {
        
        @Test
        @DisplayName("Should update CVP code successfully")
        void shouldUpdateCvpCodeSuccessfully() {
            // Given
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(cvpCode));
            when(repository.existsByNameAndIdNot(anyString(), anyLong())).thenReturn(false);
            when(subCategoryService.getEntityById(anyLong())).thenReturn(subCategory);
            when(repository.save(any(CvpCode.class))).thenReturn(cvpCode);
            when(mapper.toAdminView(any(CvpCode.class))).thenReturn(adminView);
            
            // When
            CvpCodeAdminView result = service.update(TEST_ID, input);
            
            // Then
            assertThat(result).isNotNull();
            verify(repository).save(cvpCode);
        }
        
        @Test
        @DisplayName("Should throw exception when updating to existing name")
        void shouldThrowExceptionWhenUpdatingToExistingName() {
            // Given
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(cvpCode));
            when(repository.existsByNameAndIdNot(anyString(), anyLong())).thenReturn(true);
            
            // When/Then
            assertThatThrownBy(() -> service.update(TEST_ID, input))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("already exists");
        }
    }
    
    @Nested
    @DisplayName("Delete CVP Code")
    class DeleteCvpCode {
        
        @Test
        @DisplayName("Should soft delete CVP code successfully")
        void shouldSoftDeleteCvpCodeSuccessfully() {
            // Given
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(cvpCode));
            when(repository.save(any(CvpCode.class))).thenReturn(cvpCode);
            
            // When
            service.delete(TEST_ID);
            
            // Then
            assertThat(cvpCode.getActive()).isEqualTo(ActiveStatus.N);
            verify(repository).save(cvpCode);
        }
    }
    
    @Nested
    @DisplayName("Reactivate CVP Code")
    class ReactivateCvpCode {
        
        @Test
        @DisplayName("Should reactivate CVP code successfully")
        void shouldReactivateCvpCodeSuccessfully() {
            // Given
            cvpCode.setActive(ActiveStatus.N);
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(cvpCode));
            when(repository.save(any(CvpCode.class))).thenReturn(cvpCode);
            when(mapper.toAdminView(any(CvpCode.class))).thenReturn(adminView);
            
            // When
            CvpCodeAdminView result = service.reactivate(TEST_ID);
            
            // Then
            assertThat(cvpCode.getActive()).isEqualTo(ActiveStatus.Y);
            verify(repository).save(cvpCode);
        }
    }
    
    @Nested
    @DisplayName("Get Entity By ID")
    class GetEntityById {
        
        @Test
        @DisplayName("Should return entity for internal use")
        void shouldReturnEntityForInternalUse() {
            // Given
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(cvpCode));
            
            // When
            CvpCode result = service.getEntityById(TEST_ID);
            
            // Then
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(TEST_ID);
        }
    }
}
