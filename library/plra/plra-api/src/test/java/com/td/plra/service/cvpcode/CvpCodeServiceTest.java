package com.td.plra.service.cvpcode;

import com.td.plra.application.exception.BadRequestException;
import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.persistence.entity.CvpCode;
import com.td.plra.persistence.entity.SubCategory;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.repository.CvpCodeRepository;
import com.td.plra.service.cvpcode.binding.CvpCodeBinding;
import com.td.plra.service.cvpcode.dto.CvpCodeAdminView;
import com.td.plra.service.cvpcode.dto.CvpCodeInput;
import com.td.plra.service.cvpcode.mapper.CvpCodeMapper;
import com.td.plra.service.subcategory.SubCategoryService;
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

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CvpCodeServiceTest {

    @Mock private CvpCodeRepository repository;
    @Mock private CvpCodeMapper mapper;
    @Mock private CvpCodeBinding binding;
    @Mock private SubCategoryService subCategoryService;
    @InjectMocks private CvpCodeService service;

    private CvpCode entity;
    private CvpCodeInput input;
    private CvpCodeAdminView adminView;

    @BeforeEach
    void setUp() {
        entity = TestDataFactory.cvpCode();
        input = TestDataFactory.cvpCodeInput();
        adminView = CvpCodeAdminView.builder().id(200L).name("CVP-ULOC-STD")
                .detail("Test CVP code").active(true).build();
    }

    @Nested @DisplayName("Create")
    class CreateTests {
        @Test @DisplayName("Should create CVP code with subcategory FK")
        void createSuccess() {
            when(repository.existsByName(anyString())).thenReturn(false);
            when(subCategoryService.getEntityById(100L)).thenReturn(TestDataFactory.subCategory());
            when(mapper.toEntity(any(CvpCodeInput.class))).thenReturn(entity);
            when(repository.save(any())).thenReturn(entity);
            when(mapper.toAdminView(any(CvpCode.class))).thenReturn(adminView);

            CvpCodeAdminView result = service.create(input);
            assertThat(result).isNotNull();
            assertThat(result.getName()).isEqualTo("CVP-ULOC-STD");
            verify(subCategoryService).getEntityById(100L);
            verify(repository).save(any(CvpCode.class));
        }

        @Test @DisplayName("Should reject duplicate name")
        void createDuplicate() {
            when(repository.existsByName(anyString())).thenReturn(true);
            assertThatThrownBy(() -> service.create(input))
                    .isInstanceOf(BadRequestException.class);
            verify(repository, never()).save(any());
        }
    }

    @Nested @DisplayName("Read")
    class ReadTests {
        @Test @DisplayName("Should find by ID")
        void findByIdSuccess() {
            when(repository.findById(200L)).thenReturn(Optional.of(entity));
            when(mapper.toAdminView(entity)).thenReturn(adminView);
            CvpCodeAdminView result = service.findById(200L);
            assertThat(result).isNotNull();
        }

        @Test @DisplayName("Should throw when not found by ID")
        void findByIdNotFound() {
            when(repository.findById(999L)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> service.findById(999L))
                    .isInstanceOf(EntityNotFoundException.class);
        }

        @Test @DisplayName("Should find all paginated")
        void findAllSuccess() {
            Page<CvpCode> page = new PageImpl<>(List.of(entity));
            when(binding.buildPredicate(any())).thenReturn(null);
            when(repository.findAll(any(PageRequest.class))).thenReturn(page);
            when(mapper.toAdminViewList(any())).thenReturn(List.of(adminView));

            var result = service.findAll(new HashMap<>(), PageRequest.of(0, 20));
            assertThat(result.getContent()).hasSize(1);
        }
    }

    @Nested @DisplayName("Update")
    class UpdateTests {
        @Test @DisplayName("Should update CVP code")
        void updateSuccess() {
            when(repository.findById(200L)).thenReturn(Optional.of(entity));
            when(repository.save(any())).thenReturn(entity);
            when(mapper.toAdminView(any(CvpCode.class))).thenReturn(adminView);

            CvpCodeAdminView result = service.update(200L, input);
            assertThat(result).isNotNull();
            verify(mapper).updateEntity(any(CvpCodeInput.class), any(CvpCode.class));
        }

        @Test @DisplayName("Should reject duplicate name on update")
        void updateDuplicateName() {
            CvpCodeInput newNameInput = TestDataFactory.cvpCodeInput();
            newNameInput.setName("Existing CVP");
            when(repository.findById(200L)).thenReturn(Optional.of(entity));
            when(repository.existsByName("Existing CVP")).thenReturn(true);

            assertThatThrownBy(() -> service.update(200L, newNameInput))
                    .isInstanceOf(BadRequestException.class);
        }

        @Test @DisplayName("Should change subcategory FK on update")
        void updateSubCategoryChange() {
            SubCategory newSc = TestDataFactory.subCategory(101L, "Personal LOC", TestDataFactory.category());
            CvpCodeInput changeInput = TestDataFactory.cvpCodeInput();
            changeInput.setSubCategoryId(101L);

            when(repository.findById(200L)).thenReturn(Optional.of(entity));
            when(subCategoryService.getEntityById(101L)).thenReturn(newSc);
            when(repository.save(any())).thenReturn(entity);
            when(mapper.toAdminView(any())).thenReturn(adminView);

            service.update(200L, changeInput);
            assertThat(entity.getSubCategory()).isEqualTo(newSc);
        }

        @Test @DisplayName("Should throw when updating non-existent")
        void updateNotFound() {
            when(repository.findById(999L)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> service.update(999L, input))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }

    @Nested @DisplayName("Delete / Reactivate")
    class DeleteTests {
        @Test @DisplayName("Should soft delete")
        void deleteSuccess() {
            when(repository.findById(200L)).thenReturn(Optional.of(entity));
            when(repository.save(any())).thenReturn(entity);
            service.delete(200L);
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
            when(repository.findById(200L)).thenReturn(Optional.of(entity));
            when(repository.save(any())).thenReturn(entity);
            when(mapper.toAdminView(any())).thenReturn(adminView);
            service.reactivate(200L);
            assertThat(entity.getActive()).isEqualTo(ActiveStatus.Y);
        }
    }

    @Nested @DisplayName("Internal Accessors")
    class InternalTests {
        @Test @DisplayName("Should check existsById")
        void existsById() {
            when(repository.existsById(200L)).thenReturn(true);
            assertThat(service.existsById(200L)).isTrue();
        }

        @Test @DisplayName("Should get entity by ID")
        void getById() {
            when(repository.findById(200L)).thenReturn(Optional.of(entity));
            assertThat(service.getEntityById(200L)).isNotNull();
        }

        @Test @DisplayName("Should throw not found")
        void notFound() {
            when(repository.findById(999L)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> service.getEntityById(999L))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }
}
