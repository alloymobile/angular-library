package com.td.plra.resource;

import com.td.plra.application.utils.PageResponse;
import com.td.plra.persistence.entity.Category;
import com.td.plra.service.category.CategoryService;
import com.td.plra.service.subcategory.SubCategoryService;
import com.td.plra.service.subcategory.dto.SubCategoryAdminView;
import com.td.plra.service.subcategory.dto.SubCategoryInput;
import com.td.plra.testutil.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SubCategoryResourceTest {

    @Mock private SubCategoryService service;
    @Mock private CategoryService categoryService;
    @InjectMocks private SubCategoryResource resource;

    private Category category;
    private SubCategoryAdminView adminView;
    private SubCategoryInput input;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        category = TestDataFactory.category();
        adminView = TestDataFactory.subCategoryAdminView();
        input = TestDataFactory.subCategoryInput();
        pageable = PageRequest.of(0, 20);
    }

    @Nested @DisplayName("POST — Create")
    class CreateTests {
        @Test @DisplayName("Should resolve category and return 201")
        void create() {
            when(categoryService.getEntityByName("Secured Loans")).thenReturn(category);
            when(service.create(any(SubCategoryInput.class), eq(category))).thenReturn(adminView);
            var response = resource.create("Secured Loans", input);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
            assertThat(response.getBody().isSuccess()).isTrue();
            verify(categoryService).getEntityByName("Secured Loans");
        }
    }

    @Nested @DisplayName("GET — Read")
    class ReadTests {
        @Test @DisplayName("GET /{id} → 200")
        void findById() {
            when(categoryService.getEntityByName("Secured Loans")).thenReturn(category);
            when(service.findById(100L)).thenReturn(adminView);
            var response = resource.findById("Secured Loans", 100L);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        }

        @Test @DisplayName("GET / → 200 with page")
        void findAll() {
            PageResponse<SubCategoryAdminView> page = PageResponse.<SubCategoryAdminView>builder()
                    .content(List.of(adminView)).page(0).size(20)
                    .totalElements(1).totalPages(1).first(true).last(true).empty(false).build();
            Map<String, String> params = new HashMap<>();
            when(categoryService.getEntityByName("Secured Loans")).thenReturn(category);
            when(service.findAll(any(), any())).thenReturn(page);

            // SubCategoryResource.findAll: categoryName, search, name, active,
            //   createdFrom, createdTo, unpaged, allParams, pageable
            var response = resource.findAll("Secured Loans",
                    null, null, null, null, null, false, params, pageable);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getData().getContent()).hasSize(1);
        }
    }

    @Nested @DisplayName("PUT/PATCH — Update")
    class UpdateTests {
        @Test @DisplayName("PUT /{id} → 200")
        void update() {
            when(categoryService.getEntityByName("Secured Loans")).thenReturn(category);
            when(service.update(eq(100L), any(), eq(category))).thenReturn(adminView);
            var response = resource.update("Secured Loans", 100L, input);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        }

        @Test @DisplayName("PATCH /{id} → 200")
        void patch() {
            when(categoryService.getEntityByName("Secured Loans")).thenReturn(category);
            when(service.update(eq(100L), any(), eq(category))).thenReturn(adminView);
            var response = resource.patch("Secured Loans", 100L, input);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        }
    }

    @Nested @DisplayName("DELETE / Reactivate")
    class DeleteTests {
        @Test @DisplayName("DELETE /{id} → 204")
        void delete() {
            when(categoryService.getEntityByName("Secured Loans")).thenReturn(category);
            doNothing().when(service).delete(100L);
            var response = resource.delete("Secured Loans", 100L);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        }

        @Test @DisplayName("PATCH /{id}/reactivate → 200")
        void reactivate() {
            when(categoryService.getEntityByName("Secured Loans")).thenReturn(category);
            when(service.reactivate(100L)).thenReturn(adminView);
            var response = resource.reactivate("Secured Loans", 100L);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        }
    }
}
