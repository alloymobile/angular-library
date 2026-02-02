package com.td.plra.resource;

import com.td.plra.application.utils.PageResponse;
import com.td.plra.common.BaseResourceTest;
import com.td.plra.common.TestEntityFactory;
import com.td.plra.persistence.enums.NotificationStatus;
import com.td.plra.service.notification.NotificationService;
import com.td.plra.service.notification.dto.NotificationAdminView;
import com.td.plra.service.notification.dto.NotificationInput;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(NotificationResource.class)
@DisplayName("NotificationResource Tests")
class NotificationResourceTest extends BaseResourceTest {
    
    private static final String BASE_URL = "/api/v1/notifications";
    
    @MockBean
    private NotificationService service;
    
    private NotificationInput input;
    private NotificationAdminView adminView;
    
    @BeforeEach
    void setUp() {
        input = TestEntityFactory.createNotificationInput();
        adminView = TestEntityFactory.createNotificationAdminView();
    }
    
    @Nested
    @DisplayName("POST /api/v1/notifications")
    class CreateNotification {
        
        @Test
        @DisplayName("Should create notification successfully")
        void shouldCreateNotificationSuccessfully() throws Exception {
            when(service.create(any(NotificationInput.class))).thenReturn(adminView);
            
            performPost(BASE_URL, input)
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.id", is(1)));
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/notifications/{id}")
    class GetNotificationById {
        
        @Test
        @DisplayName("Should get notification by ID")
        void shouldGetNotificationById() throws Exception {
            when(service.findById(TEST_ID)).thenReturn(adminView);
            
            performGet(BASE_URL + "/" + TEST_ID)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.id", is(1)));
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/notifications")
    class GetAllNotifications {
        
        @Test
        @DisplayName("Should get all notifications with pagination")
        void shouldGetAllNotificationsWithPagination() throws Exception {
            PageResponse<NotificationAdminView> pageResponse = PageResponse.<NotificationAdminView>builder()
                    .content(List.of(adminView))
                    .pageNumber(0)
                    .pageSize(20)
                    .totalElements(1)
                    .totalPages(1)
                    .first(true)
                    .last(true)
                    .build();
            
            when(service.findAll(any(Map.class), any(Pageable.class))).thenReturn(pageResponse);
            
            performGet(BASE_URL)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.content", hasSize(1)));
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/notifications/by-status/{status}")
    class GetByStatus {
        
        @Test
        @DisplayName("Should get notifications by status")
        void shouldGetNotificationsByStatus() throws Exception {
            when(service.findByStatus(NotificationStatus.PENDING)).thenReturn(List.of(adminView));
            
            performGet(BASE_URL + "/by-status/PENDING")
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data", hasSize(1)));
        }
    }
    
    @Nested
    @DisplayName("PUT /api/v1/notifications/{id}")
    class UpdateNotification {
        
        @Test
        @DisplayName("Should update notification successfully")
        void shouldUpdateNotificationSuccessfully() throws Exception {
            when(service.update(anyLong(), any(NotificationInput.class))).thenReturn(adminView);
            
            performPut(BASE_URL + "/" + TEST_ID, input)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)));
        }
    }
    
    @Nested
    @DisplayName("PATCH /api/v1/notifications/{id}/read")
    class MarkAsRead {
        
        @Test
        @DisplayName("Should mark notification as read")
        void shouldMarkNotificationAsRead() throws Exception {
            when(service.markAsRead(TEST_ID)).thenReturn(adminView);
            
            performPatch(BASE_URL + "/" + TEST_ID + "/read")
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)));
        }
    }
    
    @Nested
    @DisplayName("DELETE /api/v1/notifications/{id}")
    class DeleteNotification {
        
        @Test
        @DisplayName("Should delete notification successfully")
        void shouldDeleteNotificationSuccessfully() throws Exception {
            doNothing().when(service).delete(TEST_ID);
            
            performDelete(BASE_URL + "/" + TEST_ID)
                    .andExpect(status().isNoContent());
        }
    }
    
    @Nested
    @DisplayName("PATCH /api/v1/notifications/{id}/reactivate")
    class ReactivateNotification {
        
        @Test
        @DisplayName("Should reactivate notification successfully")
        void shouldReactivateNotificationSuccessfully() throws Exception {
            when(service.reactivate(TEST_ID)).thenReturn(adminView);
            
            performPatch(BASE_URL + "/" + TEST_ID + "/reactivate")
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)));
        }
    }
}
