package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.Notification;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.NotificationStatus;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
@DisplayName("NotificationRepository Integration Tests")
class NotificationRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private NotificationRepository repository;

    private Notification newNotification(String message, NotificationStatus status, ActiveStatus active) {
        Notification n = new Notification();
        n.setMessage(message);
        n.setStatus(status);
        n.setActive(active);
        n.setCreatedBy("test-user");
        n.setUpdatedBy("test-user");
        return n;
    }

    @Test
    void shouldFindByActive() {
        entityManager.persistAndFlush(newNotification("A", NotificationStatus.NEW, ActiveStatus.Y));
        entityManager.persistAndFlush(newNotification("B", NotificationStatus.NEW, ActiveStatus.N));

        assertThat(repository.findByActive(ActiveStatus.Y)).hasSize(1);
        assertThat(repository.findByActive(ActiveStatus.N)).hasSize(1);
    }

    @Test
    void shouldFindByStatus() {
        entityManager.persistAndFlush(newNotification("A", NotificationStatus.NEW, ActiveStatus.Y));
        entityManager.persistAndFlush(newNotification("B", NotificationStatus.SENT, ActiveStatus.Y));

        assertThat(repository.findByStatus(NotificationStatus.NEW)).hasSize(1);
        assertThat(repository.findByStatus(NotificationStatus.SENT)).hasSize(1);
    }

    @Test
    void shouldFindByStatusAndActive() {
        entityManager.persistAndFlush(newNotification("A", NotificationStatus.NEW, ActiveStatus.Y));
        entityManager.persistAndFlush(newNotification("B", NotificationStatus.NEW, ActiveStatus.N));

        assertThat(repository.findByStatusAndActive(NotificationStatus.NEW, ActiveStatus.Y)).hasSize(1);
        assertThat(repository.findByStatusAndActive(NotificationStatus.NEW, ActiveStatus.N)).hasSize(1);
    }
}
