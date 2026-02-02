package com.td.plra.service;

import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.common.BaseServiceTest;
import com.td.plra.common.TestEntityFactory;
import com.td.plra.persistence.entity.Notification;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.NotificationStatus;
import com.td.plra.persistence.repository.NotificationRepository;
import com.td.plra.service.notification.NotificationService;
import com.td.plra.service.notification.binding.NotificationBinding;
import com.td.plra.service.notification.dto.NotificationAdminView;
import com.td.plra.service.notification.dto.NotificationInput;
import com.td.plra.service.notification.mapper.NotificationMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

@DisplayName("NotificationService Tests")
class NotificationServiceTest extends BaseServiceTest {
    
    @Mock
    private NotificationRepository repository;
    
    @Mock
    private NotificationMapper mapper;
    
    @Mock
    private NotificationBinding binding;
    
    @InjectMocks
    private NotificationService service;
    
    private Notification notification;
    private NotificationInput input;
    private NotificationAdminView adminView;
    
    @BeforeEach
    void setUp() {
        notification = TestEntityFactory.createNotification();
        input = TestEntityFactory.createNotificationInput();
        adminView = TestEntityFactory.createNotificationAdminView();
    }
    
    @Nested
    @DisplayName("Create Notification")
    class CreateNotification {
        
        @Test
        @DisplayName("Should create notification successfully")
        void shouldCreateNotificationSuccessfully() {
            // Given
            when(mapper.toEntity(input)).thenReturn(notification);
            when(repository.save(any(Notification.class))).thenReturn(notification);
            when(mapper.toAdminView(notification)).thenReturn(adminView);
            
            // When
            NotificationAdminView result = service.create(input);
            
            // Then
            assertThat(result).isNotNull();
            verify(repository).save(any(Notification.class));
        }
    }
    
    @Nested
    @DisplayName("Find Notification By ID")
    class FindById {
        
        @Test
        @DisplayName("Should find notification by ID")
        void shouldFindNotificationById() {
            // Given
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(notification));
            when(mapper.toAdminView(notification)).thenReturn(adminView);
            
            // When
            NotificationAdminView result = service.findById(TEST_ID);
            
            // Then
            assertThat(result).isNotNull();
        }
        
        @Test
        @DisplayName("Should throw exception when not found")
        void shouldThrowExceptionWhenNotFound() {
            // Given
            when(repository.findById(TEST_ID)).thenReturn(Optional.empty());
            
            // When/Then
            assertThatThrownBy(() -> service.findById(TEST_ID))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }
    
    @Nested
    @DisplayName("Find All Notifications")
    class FindAll {
        
        @Test
        @DisplayName("Should find all notifications with pagination")
        void shouldFindAllNotificationsWithPagination() {
            // Given
            Page<Notification> page = new PageImpl<>(List.of(notification), defaultPageable, 1);
            when(binding.buildPredicate(emptyParams)).thenReturn(null);
            when(repository.findAll(defaultPageable)).thenReturn(page);
            when(mapper.toAdminViewList(anyList())).thenReturn(List.of(adminView));
            
            // When
            PageResponse<NotificationAdminView> result = service.findAll(emptyParams, defaultPageable);
            
            // Then
            assertThat(result).isNotNull();
            assertThat(result.getContent()).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("Find By Status")
    class FindByStatus {
        
        @Test
        @DisplayName("Should find notifications by status")
        void shouldFindNotificationsByStatus() {
            // Given
            when(repository.findByStatusAndActive(NotificationStatus.PENDING, ActiveStatus.Y))
                    .thenReturn(List.of(notification));
            when(mapper.toAdminViewList(anyList())).thenReturn(List.of(adminView));
            
            // When
            List<NotificationAdminView> result = service.findByStatus(NotificationStatus.PENDING);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("Mark As Read")
    class MarkAsRead {
        
        @Test
        @DisplayName("Should mark notification as read")
        void shouldMarkNotificationAsRead() {
            // Given
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(notification));
            when(repository.save(any(Notification.class))).thenReturn(notification);
            when(mapper.toAdminView(notification)).thenReturn(adminView);
            
            // When
            NotificationAdminView result = service.markAsRead(TEST_ID);
            
            // Then
            assertThat(notification.getStatus()).isEqualTo(NotificationStatus.READ);
            verify(repository).save(notification);
        }
    }
    
    @Nested
    @DisplayName("Delete Notification")
    class DeleteNotification {
        
        @Test
        @DisplayName("Should soft delete notification")
        void shouldSoftDeleteNotification() {
            // Given
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(notification));
            when(repository.save(any(Notification.class))).thenReturn(notification);
            
            // When
            service.delete(TEST_ID);
            
            // Then
            assertThat(notification.getActive()).isEqualTo(ActiveStatus.N);
            verify(repository).save(notification);
        }
    }
}
