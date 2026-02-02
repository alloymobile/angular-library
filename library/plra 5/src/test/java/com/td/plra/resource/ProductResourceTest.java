package com.td.plra.resource;

import com.td.plra.service.product.ProductService;
import com.td.plra.service.product.dto.ProductAdminView;
import com.td.plra.testsupport.JsonFixtures;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductResource.class)
class ProductResourceTest {

    @Autowired private MockMvc mockMvc;

    @MockBean private ProductService productService;

    @Test
    void createProduct_returns201_withApiResponseEnvelope() throws Exception {
        when(productService.create(org.mockito.ArgumentMatchers.any()))
                .thenReturn(ProductAdminView.builder().id(1L).name("ILOC").build());

        String body = JsonFixtures.readAsString("fixtures/product-input.json");

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.name").value("ILOC"));
    }
}
