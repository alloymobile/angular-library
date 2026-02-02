package com.td.plra.repository;

import com.td.plra.common.BaseRepositoryTest;
import com.td.plra.persistence.entity.Notification;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.NotificationStatus;
import com.td.plra.persistence.repository.NotificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("NotificationRepository Tests")
class NotificationRepositoryTest extends BaseRepositoryTest {
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Autowired
    private NotificationRepository repository;
    
    private Notification notification;
    
    @BeforeEach
    void setUp() {
        notification = new Notification();
        notification.setTitle("Rate Change Notification");
        notification.setMessage("New rate pending approval");
        notification.setStatus(NotificationStatus.PENDING);
        notification.setActive(ActiveStatus.Y);
    }
    
    @Nested
    @DisplayName("findByActive")
    class FindByActive {
        
        @Test
        @DisplayName("Should find all active notifications")
        void shouldFindAllActiveNotifications() {
            // Given
            entityManager.persistAndFlush(notification);
            
            // When
            List<Notification> result = repository.findByActive(ActiveStatus.Y);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("findByStatus")
    class FindByStatus {
        
        @Test
        @DisplayName("Should find notifications by status")
        void shouldFindNotificationsByStatus() {
            // Given
            entityManager.persistAndFlush(notification);
            
            // When
            List<Notification> result = repository.findByStatus(NotificationStatus.PENDING);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("findByStatusAndActive")
    class FindByStatusAndActive {
        
        @Test
        @DisplayName("Should find active notifications by status")
        void shouldFindActiveNotificationsByStatus() {
            // Given
            entityManager.persistAndFlush(notification);
            
            Notification inactiveNotification = new Notification();
            inactiveNotification.setTitle("Inactive Notification");
            inactiveNotification.setMessage("This is inactive");
            inactiveNotification.setStatus(NotificationStatus.PENDING);
            inactiveNotification.setActive(ActiveStatus.N);
            entityManager.persistAndFlush(inactiveNotification);
            
            // When
            List<Notification> result = repository.findByStatusAndActive(NotificationStatus.PENDING, ActiveStatus.Y);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
}
