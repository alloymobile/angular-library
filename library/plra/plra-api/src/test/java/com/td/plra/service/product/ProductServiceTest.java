package com.td.plra.service.product;

import com.td.plra.application.exception.BadRequestException;
import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.persistence.entity.Product;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.repository.ProductRepository;
import com.td.plra.service.product.binding.ProductBinding;
import com.td.plra.service.product.dto.ProductAdminView;
import com.td.plra.service.product.dto.ProductInput;
import com.td.plra.service.product.mapper.ProductMapper;
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
import org.springframework.data.domain.Pageable;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock private ProductRepository repository;
    @Mock private ProductMapper mapper;
    @Mock private ProductBinding binding;
    @InjectMocks private ProductService service;

    private Product entity;
    private ProductInput input;
    private ProductAdminView adminView;

    @BeforeEach
    void setUp() {
        entity = TestDataFactory.product();
        input = TestDataFactory.productInput();
        adminView = TestDataFactory.productAdminView();
    }

    @Nested @DisplayName("Create")
    class CreateTests {
        @Test @DisplayName("Should create product successfully")
        void createSuccess() {
            when(repository.existsByName(anyString())).thenReturn(false);
            when(mapper.toEntity(any(ProductInput.class))).thenReturn(entity);
            when(repository.save(any(Product.class))).thenReturn(entity);
            when(mapper.toAdminView(any(Product.class))).thenReturn(adminView);

            ProductAdminView result = service.create(input);

            assertThat(result).isNotNull();
            assertThat(result.getName()).isEqualTo("Personal Lending");
            verify(repository).existsByName(input.getName());
            verify(repository).save(any(Product.class));
        }

        @Test @DisplayName("Should reject duplicate product name")
        void createDuplicateName() {
            when(repository.existsByName(anyString())).thenReturn(true);

            assertThatThrownBy(() -> service.create(input))
                    .isInstanceOf(BadRequestException.class);
            verify(repository, never()).save(any());
        }
    }

    @Nested @DisplayName("Read")
    class ReadTests {
        @Test @DisplayName("Should find product by ID")
        void findByIdSuccess() {
            when(repository.findById(1L)).thenReturn(Optional.of(entity));
            when(mapper.toAdminView(entity)).thenReturn(adminView);

            ProductAdminView result = service.findById(1L);
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(1L);
        }

        @Test @DisplayName("Should throw when product not found")
        void findByIdNotFound() {
            when(repository.findById(999L)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> service.findById(999L))
                    .isInstanceOf(EntityNotFoundException.class);
        }

        @Test @DisplayName("Should find all products with pagination")
        void findAllSuccess() {
            Page<Product> page = new PageImpl<>(List.of(entity));
            Map<String, String> params = new HashMap<>();
            Pageable pageable = PageRequest.of(0, 20);

            when(binding.buildPredicate(params)).thenReturn(null);
            when(repository.findAll(pageable)).thenReturn(page);
            when(mapper.toAdminViewList(any())).thenReturn(List.of(adminView));

            var result = service.findAll(params, pageable);
            assertThat(result.getContent()).hasSize(1);
            assertThat(result.getTotalElements()).isEqualTo(1);
        }
    }

    @Nested @DisplayName("Update")
    class UpdateTests {
        @Test @DisplayName("Should update product successfully")
        void updateSuccess() {
            when(repository.findById(1L)).thenReturn(Optional.of(entity));
            when(repository.existsByName(anyString())).thenReturn(false);
            when(repository.save(any(Product.class))).thenReturn(entity);
            when(mapper.toAdminView(any(Product.class))).thenReturn(adminView);

            ProductInput updateInput = TestDataFactory.productInput("Updated Name");
            ProductAdminView result = service.update(1L, updateInput);
            assertThat(result).isNotNull();
            verify(mapper).updateEntity(any(ProductInput.class), any(Product.class));
        }

        @Test @DisplayName("Should reject update with duplicate name")
        void updateDuplicateName() {
            ProductInput updateInput = TestDataFactory.productInput("Existing Name");
            when(repository.findById(1L)).thenReturn(Optional.of(entity));
            when(repository.existsByName("Existing Name")).thenReturn(true);

            assertThatThrownBy(() -> service.update(1L, updateInput))
                    .isInstanceOf(BadRequestException.class);
        }

        @Test @DisplayName("Should allow update with same name (no change)")
        void updateSameName() {
            when(repository.findById(1L)).thenReturn(Optional.of(entity));
            when(repository.save(any(Product.class))).thenReturn(entity);
            when(mapper.toAdminView(any(Product.class))).thenReturn(adminView);

            ProductAdminView result = service.update(1L, input);
            assertThat(result).isNotNull();
            verify(repository, never()).existsByName(anyString());
        }
    }

    @Nested @DisplayName("Delete / Reactivate")
    class DeleteReactivateTests {
        @Test @DisplayName("Should soft delete product")
        void deleteSuccess() {
            when(repository.findById(1L)).thenReturn(Optional.of(entity));
            when(repository.save(any(Product.class))).thenReturn(entity);

            service.delete(1L);

            assertThat(entity.getActive()).isEqualTo(ActiveStatus.N);
            verify(repository).save(entity);
        }

        @Test @DisplayName("Should throw when deleting non-existent product")
        void deleteNotFound() {
            when(repository.findById(999L)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> service.delete(999L))
                    .isInstanceOf(EntityNotFoundException.class);
        }

        @Test @DisplayName("Should reactivate product")
        void reactivateSuccess() {
            entity.setActive(ActiveStatus.N);
            when(repository.findById(1L)).thenReturn(Optional.of(entity));
            when(repository.save(any(Product.class))).thenReturn(entity);
            when(mapper.toAdminView(any(Product.class))).thenReturn(adminView);

            ProductAdminView result = service.reactivate(1L);
            assertThat(entity.getActive()).isEqualTo(ActiveStatus.Y);
            assertThat(result).isNotNull();
        }
    }

    @Nested @DisplayName("Internal Accessors")
    class InternalAccessorTests {
        @Test @DisplayName("Should check existsById")
        void existsById() {
            when(repository.existsById(1L)).thenReturn(true);
            assertThat(service.existsById(1L)).isTrue();
        }

        @Test @DisplayName("Should get entity by ID")
        void getEntityById() {
            when(repository.findById(1L)).thenReturn(Optional.of(entity));
            Product result = service.getEntityById(1L);
            assertThat(result.getName()).isEqualTo("Personal Lending");
        }

        @Test @DisplayName("Should get entity by name")
        void getEntityByName() {
            when(repository.findByName("Personal Lending")).thenReturn(Optional.of(entity));
            Product result = service.getEntityByName("Personal Lending");
            assertThat(result).isNotNull();
        }

        @Test @DisplayName("Should throw when entity not found by name")
        void getEntityByNameNotFound() {
            when(repository.findByName("Unknown")).thenReturn(Optional.empty());
            assertThatThrownBy(() -> service.getEntityByName("Unknown"))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }
}
