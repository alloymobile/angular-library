package com.td.plra.resource;

import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.exception.GlobalExceptionHandler;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.common.BaseResourceTest;
import com.td.plra.common.TestFixtures;
import com.td.plra.persistence.enums.NotificationStatus;
import com.td.plra.service.notification.NotificationService;
import com.td.plra.service.notification.dto.NotificationAdminView;
import com.td.plra.service.notification.dto.NotificationInput;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("NotificationResource Tests")
class NotificationResourceTest extends BaseResourceTest {
    
    private static final String BASE_URL = "/api/v1/notifications";
    
    @Mock
    private NotificationService service;
    
    @InjectMocks
    private NotificationResource resource;
    
    private NotificationInput input;
    private NotificationAdminView adminView;
    
    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(resource)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        
        input = TestFixtures.createNotificationInput();
        adminView = TestFixtures.createNotificationAdminView();
    }
    
    @Nested
    @DisplayName("POST /api/v1/notifications")
    class CreateNotification {
        
        @Test
        @DisplayName("Should create notification and return 201")
        void shouldCreateNotificationAndReturn201() throws Exception {
            // Given
            when(service.create(any(NotificationInput.class))).thenReturn(adminView);
            
            // When/Then
            performPost(BASE_URL, input)
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.id").value(adminView.getId()))
                    .andExpect(jsonPath("$.data.status").value("PENDING"));
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/notifications/{id}")
    class GetNotificationById {
        
        @Test
        @DisplayName("Should return notification when found")
        void shouldReturnNotificationWhenFound() throws Exception {
            // Given
            when(service.findById(TEST_ID)).thenReturn(adminView);
            
            // When/Then
            performGet(BASE_URL + "/" + TEST_ID)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.id").value(adminView.getId()));
        }
        
        @Test
        @DisplayName("Should return 404 when not found")
        void shouldReturn404WhenNotFound() throws Exception {
            // Given
            when(service.findById(INVALID_ID))
                    .thenThrow(new EntityNotFoundException("Notification", INVALID_ID));
            
            // When/Then
            performGet(BASE_URL + "/" + INVALID_ID)
                    .andExpect(status().isNotFound());
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/notifications")
    class GetAllNotifications {
        
        @Test
        @DisplayName("Should return paginated notifications")
        void shouldReturnPaginatedNotifications() throws Exception {
            // Given
            PageResponse<NotificationAdminView> pageResponse = PageResponse.from(
                    new PageImpl<>(List.of(adminView)), List.of(adminView));
            
            when(service.findAll(any(Map.class), any(Pageable.class))).thenReturn(pageResponse);
            
            // When/Then
            performGet(BASE_URL)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.content", hasSize(1)));
        }
        
        @Test
        @DisplayName("Should filter notifications by status")
        void shouldFilterNotificationsByStatus() throws Exception {
            // Given
            PageResponse<NotificationAdminView> pageResponse = PageResponse.from(
                    new PageImpl<>(List.of(adminView)), List.of(adminView));
            
            when(service.findAll(any(Map.class), any(Pageable.class))).thenReturn(pageResponse);
            
            // When/Then
            mockMvc.perform(get(BASE_URL)
                            .param("status", "PENDING"))
                    .andExpect(status().isOk());
            
            verify(service).findAll(any(Map.class), any(Pageable.class));
        }
    }
    
    @Nested
    @DisplayName("PUT /api/v1/notifications/{id}")
    class UpdateNotification {
        
        @Test
        @DisplayName("Should update notification successfully")
        void shouldUpdateNotificationSuccessfully() throws Exception {
            // Given
            when(service.update(eq(TEST_ID), any(NotificationInput.class))).thenReturn(adminView);
            
            // When/Then
            performPut(BASE_URL + "/" + TEST_ID, input)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true));
        }
    }
    
    @Nested
    @DisplayName("PATCH /api/v1/notifications/{id}/status")
    class UpdateNotificationStatus {
        
        @Test
        @DisplayName("Should update notification status successfully")
        void shouldUpdateNotificationStatusSuccessfully() throws Exception {
            // Given
            NotificationAdminView sentView = NotificationAdminView.builder()
                    .id(1L)
                    .detail("Test notification")
                    .status(NotificationStatus.SENT)
                    .active(true)
                    .build();
            
            when(service.updateStatus(eq(TEST_ID), eq(NotificationStatus.SENT))).thenReturn(sentView);
            
            // When/Then
            mockMvc.perform(patch(BASE_URL + "/" + TEST_ID + "/status")
                            .param("status", "SENT"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.status").value("SENT"));
            
            verify(service).updateStatus(TEST_ID, NotificationStatus.SENT);
        }
        
        @Test
        @DisplayName("Should return 404 when notification not found for status update")
        void shouldReturn404WhenNotFoundForStatusUpdate() throws Exception {
            // Given
            when(service.updateStatus(eq(INVALID_ID), any(NotificationStatus.class)))
                    .thenThrow(new EntityNotFoundException("Notification", INVALID_ID));
            
            // When/Then
            mockMvc.perform(patch(BASE_URL + "/" + INVALID_ID + "/status")
                            .param("status", "SENT"))
                    .andExpect(status().isNotFound());
        }
    }
    
    @Nested
    @DisplayName("DELETE /api/v1/notifications/{id}")
    class DeleteNotification {
        
        @Test
        @DisplayName("Should delete notification and return 204")
        void shouldDeleteNotificationAndReturn204() throws Exception {
            // Given
            doNothing().when(service).delete(TEST_ID);
            
            // When/Then
            performDelete(BASE_URL + "/" + TEST_ID)
                    .andExpect(status().isNoContent());
        }
    }
}
