package com.td.plra.service;

import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.common.BaseServiceTest;
import com.td.plra.common.TestFixtures;
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
        notification = TestFixtures.createNotification();
        input = TestFixtures.createNotificationInput();
        adminView = TestFixtures.createNotificationAdminView();
    }
    
    @Nested
    @DisplayName("Create Notification")
    class CreateNotification {
        
        @Test
        @DisplayName("Should create notification successfully")
        void shouldCreateNotificationSuccessfully() {
            // Given
            when(mapper.toEntity(any(NotificationInput.class))).thenReturn(notification);
            when(repository.save(any(Notification.class))).thenReturn(notification);
            when(mapper.toAdminView(any(Notification.class))).thenReturn(adminView);
            
            // When
            NotificationAdminView result = service.create(input);
            
            // Then
            assertThat(result).isNotNull();
            assertThat(result.getStatus()).isEqualTo(NotificationStatus.PENDING);
            verify(repository).save(any(Notification.class));
        }
    }
    
    @Nested
    @DisplayName("Find Notification By ID")
    class FindById {
        
        @Test
        @DisplayName("Should find notification by ID successfully")
        void shouldFindNotificationByIdSuccessfully() {
            // Given
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(notification));
            when(mapper.toAdminView(notification)).thenReturn(adminView);
            
            // When
            NotificationAdminView result = service.findById(TEST_ID);
            
            // Then
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(TEST_ID);
        }
        
        @Test
        @DisplayName("Should throw exception when notification not found")
        void shouldThrowExceptionWhenNotFound() {
            // Given
            when(repository.findById(INVALID_ID)).thenReturn(Optional.empty());
            
            // When/Then
            assertThatThrownBy(() -> service.findById(INVALID_ID))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessageContaining("Notification");
        }
    }
    
    @Nested
    @DisplayName("Find All Notifications")
    class FindAll {
        
        @Test
        @DisplayName("Should find all notifications with pagination")
        void shouldFindAllNotificationsWithPagination() {
            // Given
            Page<Notification> notificationPage = new PageImpl<>(List.of(notification), defaultPageable, 1);
            when(binding.buildPredicate(any())).thenReturn(null);
            when(repository.findAll(defaultPageable)).thenReturn(notificationPage);
            when(mapper.toAdminViewList(anyList())).thenReturn(List.of(adminView));
            
            // When
            PageResponse<NotificationAdminView> result = service.findAll(emptyParams, defaultPageable);
            
            // Then
            assertThat(result).isNotNull();
            assertThat(result.getContent()).hasSize(1);
        }
        
        @Test
        @DisplayName("Should filter notifications by status")
        void shouldFilterNotificationsByStatus() {
            // Given
            Page<Notification> notificationPage = new PageImpl<>(List.of(notification), defaultPageable, 1);
            when(binding.buildPredicate(any())).thenReturn(null);
            when(repository.findAll(defaultPageable)).thenReturn(notificationPage);
            when(mapper.toAdminViewList(anyList())).thenReturn(List.of(adminView));
            
            // When
            PageResponse<NotificationAdminView> result = service.findAll(
                    paramsWithStatus("PENDING"), defaultPageable);
            
            // Then
            assertThat(result).isNotNull();
            verify(binding).buildPredicate(any());
        }
    }
    
    @Nested
    @DisplayName("Update Notification")
    class UpdateNotification {
        
        @Test
        @DisplayName("Should update notification successfully")
        void shouldUpdateNotificationSuccessfully() {
            // Given
            NotificationInput updateInput = NotificationInput.builder()
                    .detail("Updated notification")
                    .status(NotificationStatus.SENT)
                    .build();
            
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(notification));
            when(repository.save(any(Notification.class))).thenReturn(notification);
            when(mapper.toAdminView(any(Notification.class))).thenReturn(adminView);
            
            // When
            NotificationAdminView result = service.update(TEST_ID, updateInput);
            
            // Then
            assertThat(result).isNotNull();
            verify(mapper).updateEntity(updateInput, notification);
            verify(repository).save(notification);
        }
    }
    
    @Nested
    @DisplayName("Update Notification Status")
    class UpdateNotificationStatus {
        
        @Test
        @DisplayName("Should update notification status successfully")
        void shouldUpdateNotificationStatusSuccessfully() {
            // Given
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(notification));
            when(repository.save(any(Notification.class))).thenReturn(notification);
            when(mapper.toAdminView(any(Notification.class))).thenReturn(adminView);
            
            // When
            NotificationAdminView result = service.updateStatus(TEST_ID, NotificationStatus.SENT);
            
            // Then
            assertThat(notification.getStatus()).isEqualTo(NotificationStatus.SENT);
            verify(repository).save(notification);
        }
        
        @Test
        @DisplayName("Should update to DELIVERED status")
        void shouldUpdateToDeliveredStatus() {
            // Given
            notification.setStatus(NotificationStatus.SENT);
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(notification));
            when(repository.save(any(Notification.class))).thenReturn(notification);
            when(mapper.toAdminView(any(Notification.class))).thenReturn(adminView);
            
            // When
            service.updateStatus(TEST_ID, NotificationStatus.DELIVERED);
            
            // Then
            assertThat(notification.getStatus()).isEqualTo(NotificationStatus.DELIVERED);
        }
        
        @Test
        @DisplayName("Should update to FAILED status")
        void shouldUpdateToFailedStatus() {
            // Given
            notification.setStatus(NotificationStatus.SENT);
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(notification));
            when(repository.save(any(Notification.class))).thenReturn(notification);
            when(mapper.toAdminView(any(Notification.class))).thenReturn(adminView);
            
            // When
            service.updateStatus(TEST_ID, NotificationStatus.FAILED);
            
            // Then
            assertThat(notification.getStatus()).isEqualTo(NotificationStatus.FAILED);
        }
        
        @Test
        @DisplayName("Should throw exception when notification not found for status update")
        void shouldThrowExceptionWhenNotFoundForStatusUpdate() {
            // Given
            when(repository.findById(INVALID_ID)).thenReturn(Optional.empty());
            
            // When/Then
            assertThatThrownBy(() -> service.updateStatus(INVALID_ID, NotificationStatus.SENT))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }
    
    @Nested
    @DisplayName("Delete Notification")
    class DeleteNotification {
        
        @Test
        @DisplayName("Should soft delete notification successfully")
        void shouldSoftDeleteNotificationSuccessfully() {
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
