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
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock private ProductRepository repository;
    @Mock private ProductMapper mapper;
    @Mock private ProductBinding binding;

    @InjectMocks private ProductService service;

    @Test
    void create_throwsWhenNameExists() {
        ProductInput input = ProductInput.builder().name("ILOC").build();
        when(repository.existsByName("ILOC")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> service.create(input));
        verify(repository, never()).save(any());
    }

    @Test
    void create_savesEntity_andReturnsView() {
        ProductInput input = ProductInput.builder().name("ILOC").type("LOAN").securityCode("SEC").detail("d").build();

        Product entity = new Product();
        entity.setName("ILOC");
        entity.setActive(ActiveStatus.Y);

        Product saved = new Product();
        saved.setId(1L);
        saved.setName("ILOC");
        saved.setActive(ActiveStatus.Y);

        ProductAdminView view = ProductAdminView.builder().id(1L).name("ILOC").build();

        when(repository.existsByName("ILOC")).thenReturn(false);
        when(mapper.toEntity(input)).thenReturn(entity);
        when(repository.save(entity)).thenReturn(saved);
        when(mapper.toAdminView(saved)).thenReturn(view);

        ProductAdminView out = service.create(input);

        assertEquals(1L, out.getId());
        assertEquals("ILOC", out.getName());
    }

    @Test
    void update_throwsWhenNotFound() {
        when(repository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(EntityNotFoundException.class,
                () -> service.update(99L, ProductInput.builder().name("X").build()));
    }

    @Test
    void delete_setsActiveN_andSaves() {
        Product entity = new Product();
        entity.setId(1L);
        entity.setName("ILOC");
        entity.setActive(ActiveStatus.Y);

        when(repository.findById(1L)).thenReturn(Optional.of(entity));
        when(repository.save(any(Product.class))).thenAnswer(inv -> inv.getArgument(0));

        service.delete(1L);

        ArgumentCaptor<Product> captor = ArgumentCaptor.forClass(Product.class);
        verify(repository).save(captor.capture());
        assertEquals(ActiveStatus.N, captor.getValue().getActive());
    }
}
