package com.td.plra.service.category;

import com.td.plra.application.exception.BadRequestException;
import com.td.plra.persistence.entity.Category;
import com.td.plra.persistence.entity.Product;
import com.td.plra.persistence.repository.CategoryRepository;
import com.td.plra.service.category.binding.CategoryBinding;
import com.td.plra.service.category.dto.CategoryAdminView;
import com.td.plra.service.category.dto.CategoryInput;
import com.td.plra.service.category.mapper.CategoryMapper;
import com.td.plra.service.product.ProductService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock private CategoryRepository repository;
    @Mock private CategoryMapper mapper;
    @Mock private ProductService productService;
    @Mock private CategoryBinding binding;

    @InjectMocks private CategoryService service;

    @Test
    void create_throwsWhenNameExists() {
        CategoryInput input = CategoryInput.builder().name("Cat").productId(1L).build();
        when(repository.existsByName("Cat")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> service.create(input));
        verify(repository, never()).save(any());
    }

    @Test
    void create_setsProductOnEntity_beforeSave() {
        CategoryInput input = CategoryInput.builder().name("Cat").detail("d").productId(1L).build();

        Product product = new Product();
        product.setId(1L);

        Category entity = new Category();
        entity.setName("Cat");

        Category saved = new Category();
        saved.setId(10L);
        saved.setName("Cat");
        saved.setProduct(product);

        CategoryAdminView view = CategoryAdminView.builder().id(10L).name("Cat").build();

        when(repository.existsByName("Cat")).thenReturn(false);
        when(productService.getEntityById(1L)).thenReturn(product);
        when(mapper.toEntity(input)).thenReturn(entity);
        when(repository.save(any(Category.class))).thenReturn(saved);
        when(mapper.toAdminView(saved)).thenReturn(view);

        CategoryAdminView out = service.create(input);

        assertEquals(10L, out.getId());

        ArgumentCaptor<Category> captor = ArgumentCaptor.forClass(Category.class);
        verify(repository).save(captor.capture());
        assertNotNull(captor.getValue().getProduct());
        assertEquals(1L, captor.getValue().getProduct().getId());
    }
}
