package com.td.plra.service;

import com.td.plra.application.exception.BadRequestException;
import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.common.BaseServiceTest;
import com.td.plra.common.TestEntityFactory;
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
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyLong;
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
        subCategory = TestEntityFactory.createSubCategory();
        cvpCode = TestEntityFactory.createCvpCode();
        input = TestEntityFactory.createCvpCodeInput();
        adminView = TestEntityFactory.createCvpCodeAdminView();
    }
    
    @Nested
    @DisplayName("Create CvpCode")
    class CreateCvpCode {
        
        @Test
        @DisplayName("Should create CVP code successfully")
        void shouldCreateCvpCodeSuccessfully() {
            // Given
            when(repository.existsByName(input.getName())).thenReturn(false);
            when(subCategoryService.getEntityById(anyLong())).thenReturn(subCategory);
            when(mapper.toEntity(input)).thenReturn(cvpCode);
            when(repository.save(any(CvpCode.class))).thenReturn(cvpCode);
            when(mapper.toAdminView(cvpCode)).thenReturn(adminView);
            
            // When
            CvpCodeAdminView result = service.create(input);
            
            // Then
            assertThat(result).isNotNull();
            verify(repository).save(any(CvpCode.class));
        }
        
        @Test
        @DisplayName("Should throw exception when name already exists")
        void shouldThrowExceptionWhenNameExists() {
            // Given
            when(repository.existsByName(input.getName())).thenReturn(true);
            
            // When/Then
            assertThatThrownBy(() -> service.create(input))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("name already exists");
        }
    }
    
    @Nested
    @DisplayName("Find CvpCode By ID")
    class FindById {
        
        @Test
        @DisplayName("Should find CVP code by ID")
        void shouldFindCvpCodeById() {
            // Given
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(cvpCode));
            when(mapper.toAdminView(cvpCode)).thenReturn(adminView);
            
            // When
            CvpCodeAdminView result = service.findById(TEST_ID);
            
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
    @DisplayName("Find All CvpCodes")
    class FindAll {
        
        @Test
        @DisplayName("Should find all CVP codes with pagination")
        void shouldFindAllCvpCodesWithPagination() {
            // Given
            Page<CvpCode> page = new PageImpl<>(List.of(cvpCode), defaultPageable, 1);
            when(binding.buildPredicate(emptyParams)).thenReturn(null);
            when(repository.findAll(defaultPageable)).thenReturn(page);
            when(mapper.toAdminViewList(anyList())).thenReturn(List.of(adminView));
            
            // When
            PageResponse<CvpCodeAdminView> result = service.findAll(emptyParams, defaultPageable);
            
            // Then
            assertThat(result).isNotNull();
            assertThat(result.getContent()).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("Find By SubCategory")
    class FindBySubCategory {
        
        @Test
        @DisplayName("Should find CVP codes by subcategory ID")
        void shouldFindCvpCodesBySubCategoryId() {
            // Given
            when(subCategoryService.getEntityById(TEST_ID)).thenReturn(subCategory);
            when(repository.findBySubCategoryAndActive(subCategory, ActiveStatus.Y))
                    .thenReturn(List.of(cvpCode));
            when(mapper.toAdminViewList(anyList())).thenReturn(List.of(adminView));
            
            // When
            List<CvpCodeAdminView> result = service.findBySubCategoryId(TEST_ID);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("Delete CvpCode")
    class DeleteCvpCode {
        
        @Test
        @DisplayName("Should soft delete CVP code")
        void shouldSoftDeleteCvpCode() {
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
}
