package com.td.plra.service.category;

import com.td.plra.application.exception.BadRequestException;
import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.persistence.entity.Category;
import com.td.plra.persistence.entity.Product;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.repository.CategoryRepository;
import com.td.plra.service.category.binding.CategoryBinding;
import com.td.plra.service.category.dto.CategoryAdminView;
import com.td.plra.service.category.dto.CategoryInput;
import com.td.plra.service.category.mapper.CategoryMapper;
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
class CategoryServiceTest {

    @Mock private CategoryRepository repository;
    @Mock private CategoryMapper mapper;
    @Mock private CategoryBinding binding;
    @InjectMocks private CategoryService service;

    private Category entity;
    private Product product;
    private CategoryInput input;
    private CategoryAdminView adminView;

    @BeforeEach
    void setUp() {
        product = TestDataFactory.product();
        entity = TestDataFactory.category();
        input = TestDataFactory.categoryInput();
        adminView = TestDataFactory.categoryAdminView();
    }

    @Nested @DisplayName("Create")
    class CreateTests {
        @Test @DisplayName("Should create category with product FK")
        void createSuccess() {
            when(repository.existsByName(anyString())).thenReturn(false);
            when(mapper.toEntity(any(CategoryInput.class))).thenReturn(entity);
            when(repository.save(any(Category.class))).thenReturn(entity);
            when(mapper.toAdminView(any(Category.class))).thenReturn(adminView);

            CategoryAdminView result = service.create(input, product);

            assertThat(result).isNotNull();
            assertThat(entity.getProduct()).isEqualTo(product);
            verify(repository).save(any(Category.class));
        }

        @Test @DisplayName("Should reject duplicate name")
        void createDuplicate() {
            when(repository.existsByName(anyString())).thenReturn(true);
            assertThatThrownBy(() -> service.create(input, product))
                    .isInstanceOf(BadRequestException.class);
            verify(repository, never()).save(any());
        }
    }

    @Nested @DisplayName("Read")
    class ReadTests {
        @Test @DisplayName("Should find by ID")
        void findByIdSuccess() {
            when(repository.findById(10L)).thenReturn(Optional.of(entity));
            when(mapper.toAdminView(entity)).thenReturn(adminView);
            CategoryAdminView result = service.findById(10L);
            assertThat(result).isNotNull();
            assertThat(result.getName()).isEqualTo("Secured Loans");
        }

        @Test @DisplayName("Should throw when not found by ID")
        void findByIdNotFound() {
            when(repository.findById(999L)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> service.findById(999L))
                    .isInstanceOf(EntityNotFoundException.class);
        }

        @Test @DisplayName("Should find all paginated")
        void findAllSuccess() {
            Page<Category> page = new PageImpl<>(List.of(entity));
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
        @Test @DisplayName("Should update category and change product FK")
        void updateWithNewProduct() {
            Product newProduct = TestDataFactory.product(2L, "Business Lending");
            when(repository.findById(10L)).thenReturn(Optional.of(entity));
            when(repository.save(any(Category.class))).thenReturn(entity);
            when(mapper.toAdminView(any(Category.class))).thenReturn(adminView);

            service.update(10L, input, newProduct);
            assertThat(entity.getProduct()).isEqualTo(newProduct);
            verify(mapper).updateEntity(any(CategoryInput.class), any(Category.class));
        }

        @Test @DisplayName("Should allow update with same name (no duplicate check)")
        void updateSameName() {
            when(repository.findById(10L)).thenReturn(Optional.of(entity));
            when(repository.save(any())).thenReturn(entity);
            when(mapper.toAdminView(any())).thenReturn(adminView);

            service.update(10L, input, product);
            verify(repository, never()).existsByName(anyString());
        }

        @Test @DisplayName("Should reject update with duplicate name")
        void updateDuplicateName() {
            CategoryInput newNameInput = TestDataFactory.categoryInput();
            newNameInput.setName("Existing Category");
            when(repository.findById(10L)).thenReturn(Optional.of(entity));
            when(repository.existsByName("Existing Category")).thenReturn(true);

            assertThatThrownBy(() -> service.update(10L, newNameInput, product))
                    .isInstanceOf(BadRequestException.class);
        }

        @Test @DisplayName("Should throw when updating non-existent category")
        void updateNotFound() {
            when(repository.findById(999L)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> service.update(999L, input, product))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }

    @Nested @DisplayName("Delete / Reactivate")
    class DeleteReactivateTests {
        @Test @DisplayName("Should soft delete")
        void deleteSuccess() {
            when(repository.findById(10L)).thenReturn(Optional.of(entity));
            when(repository.save(any())).thenReturn(entity);
            service.delete(10L);
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
            when(repository.findById(10L)).thenReturn(Optional.of(entity));
            when(repository.save(any())).thenReturn(entity);
            when(mapper.toAdminView(any())).thenReturn(adminView);
            service.reactivate(10L);
            assertThat(entity.getActive()).isEqualTo(ActiveStatus.Y);
        }
    }

    @Nested @DisplayName("Internal Accessors")
    class InternalTests {
        @Test @DisplayName("Should check existsById")
        void existsById() {
            when(repository.existsById(10L)).thenReturn(true);
            assertThat(service.existsById(10L)).isTrue();
        }

        @Test @DisplayName("Should get entity by ID")
        void getEntityById() {
            when(repository.findById(10L)).thenReturn(Optional.of(entity));
            Category result = service.getEntityById(10L);
            assertThat(result.getName()).isEqualTo("Secured Loans");
        }

        @Test @DisplayName("Should throw when entity not found by ID")
        void getEntityByIdNotFound() {
            when(repository.findById(999L)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> service.getEntityById(999L))
                    .isInstanceOf(EntityNotFoundException.class);
        }

        @Test @DisplayName("Should get entity by name")
        void getByName() {
            when(repository.findByName("Secured Loans")).thenReturn(Optional.of(entity));
            assertThat(service.getEntityByName("Secured Loans")).isNotNull();
        }

        @Test @DisplayName("Should throw not found by name")
        void getByNameNotFound() {
            when(repository.findByName("X")).thenReturn(Optional.empty());
            assertThatThrownBy(() -> service.getEntityByName("X"))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }
}
