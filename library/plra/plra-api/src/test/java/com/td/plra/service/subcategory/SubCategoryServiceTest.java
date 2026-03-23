package com.td.plra.service.subcategory;

import com.td.plra.application.exception.BadRequestException;
import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.persistence.entity.Category;
import com.td.plra.persistence.entity.SubCategory;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.repository.SubCategoryRepository;
import com.td.plra.service.subcategory.binding.SubCategoryBinding;
import com.td.plra.service.subcategory.dto.SubCategoryAdminView;
import com.td.plra.service.subcategory.dto.SubCategoryInput;
import com.td.plra.service.subcategory.mapper.SubCategoryMapper;
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
class SubCategoryServiceTest {

    @Mock private SubCategoryRepository repository;
    @Mock private SubCategoryMapper mapper;
    @Mock private SubCategoryBinding binding;
    @InjectMocks private SubCategoryService service;

    private SubCategory entity;
    private Category category;
    private SubCategoryInput input;
    private SubCategoryAdminView adminView;

    @BeforeEach
    void setUp() {
        category = TestDataFactory.category();
        entity = TestDataFactory.subCategory();
        input = TestDataFactory.subCategoryInput();
        adminView = TestDataFactory.subCategoryAdminView();
    }

    @Nested @DisplayName("Create")
    class CreateTests {
        @Test @DisplayName("Should create subcategory with category FK")
        void createSuccess() {
            when(repository.existsByName(anyString())).thenReturn(false);
            when(mapper.toEntity(any(SubCategoryInput.class))).thenReturn(entity);
            when(repository.save(any())).thenReturn(entity);
            when(mapper.toAdminView(any(SubCategory.class))).thenReturn(adminView);

            SubCategoryAdminView result = service.create(input, category);
            assertThat(result).isNotNull();
            assertThat(entity.getCategory()).isEqualTo(category);
            verify(repository).save(any(SubCategory.class));
        }

        @Test @DisplayName("Should reject duplicate name")
        void createDuplicate() {
            when(repository.existsByName(anyString())).thenReturn(true);
            assertThatThrownBy(() -> service.create(input, category))
                    .isInstanceOf(BadRequestException.class);
            verify(repository, never()).save(any());
        }
    }

    @Nested @DisplayName("Read")
    class ReadTests {
        @Test @DisplayName("Should find by ID")
        void findByIdSuccess() {
            when(repository.findById(100L)).thenReturn(Optional.of(entity));
            when(mapper.toAdminView(entity)).thenReturn(adminView);
            assertThat(service.findById(100L)).isNotNull();
        }

        @Test @DisplayName("Should throw when not found by ID")
        void findByIdNotFound() {
            when(repository.findById(999L)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> service.findById(999L))
                    .isInstanceOf(EntityNotFoundException.class);
        }

        @Test @DisplayName("Should find all paginated")
        void findAllSuccess() {
            Page<SubCategory> page = new PageImpl<>(List.of(entity));
            when(binding.buildPredicate(any())).thenReturn(null);
            when(repository.findAll(any(PageRequest.class))).thenReturn(page);
            when(mapper.toAdminViewList(any())).thenReturn(List.of(adminView));

            var result = service.findAll(new HashMap<>(), PageRequest.of(0, 20));
            assertThat(result.getContent()).hasSize(1);
            assertThat(result.getTotalElements()).isEqualTo(1);
        }
    }

    @Nested @DisplayName("Update")
    class UpdateTests {
        @Test @DisplayName("Should update with new category FK")
        void updateSuccess() {
            Category newCat = TestDataFactory.category(11L, "Unsecured Loans", TestDataFactory.product());
            when(repository.findById(100L)).thenReturn(Optional.of(entity));
            when(repository.save(any())).thenReturn(entity);
            when(mapper.toAdminView(any(SubCategory.class))).thenReturn(adminView);

            service.update(100L, input, newCat);
            assertThat(entity.getCategory()).isEqualTo(newCat);
            verify(mapper).updateEntity(any(SubCategoryInput.class), any(SubCategory.class));
        }

        @Test @DisplayName("Should reject duplicate name on update")
        void updateDuplicateName() {
            SubCategoryInput newNameInput = TestDataFactory.subCategoryInput();
            newNameInput.setName("Existing SubCategory");
            when(repository.findById(100L)).thenReturn(Optional.of(entity));
            when(repository.existsByName("Existing SubCategory")).thenReturn(true);

            assertThatThrownBy(() -> service.update(100L, newNameInput, category))
                    .isInstanceOf(BadRequestException.class);
        }

        @Test @DisplayName("Should throw when updating non-existent")
        void updateNotFound() {
            when(repository.findById(999L)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> service.update(999L, input, category))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }

    @Nested @DisplayName("Delete / Reactivate")
    class DeleteTests {
        @Test @DisplayName("Should soft delete")
        void deleteSuccess() {
            when(repository.findById(100L)).thenReturn(Optional.of(entity));
            when(repository.save(any())).thenReturn(entity);
            service.delete(100L);
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
            when(repository.findById(100L)).thenReturn(Optional.of(entity));
            when(repository.save(any())).thenReturn(entity);
            when(mapper.toAdminView(any())).thenReturn(adminView);
            service.reactivate(100L);
            assertThat(entity.getActive()).isEqualTo(ActiveStatus.Y);
        }
    }

    @Nested @DisplayName("Internal Accessors")
    class InternalTests {
        @Test @DisplayName("Should check existsById")
        void existsById() {
            when(repository.existsById(100L)).thenReturn(true);
            assertThat(service.existsById(100L)).isTrue();
        }

        @Test @DisplayName("Should get entity by ID")
        void getEntityById() {
            when(repository.findById(100L)).thenReturn(Optional.of(entity));
            assertThat(service.getEntityById(100L).getName()).isEqualTo("Investment LOC");
        }

        @Test @DisplayName("Should throw when entity not found by ID")
        void getEntityByIdNotFound() {
            when(repository.findById(999L)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> service.getEntityById(999L))
                    .isInstanceOf(EntityNotFoundException.class);
        }

        @Test @DisplayName("Should get entity by name")
        void getByName() {
            when(repository.findByName("Investment LOC")).thenReturn(Optional.of(entity));
            assertThat(service.getEntityByName("Investment LOC")).isNotNull();
        }

        @Test @DisplayName("Should throw not found by name")
        void getByNameNotFound() {
            when(repository.findByName("X")).thenReturn(Optional.empty());
            assertThatThrownBy(() -> service.getEntityByName("X"))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }
}
