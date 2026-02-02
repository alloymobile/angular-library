package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.Notification;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.NotificationStatus;
import com.td.plra.testsupport.AuditingTestConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
@Import(AuditingTestConfig.class)
class NotificationRepositoryTest {

    @Autowired private NotificationRepository repository;

    @Test
    void notification_queries_work() {
        Notification n1 = new Notification();
        n1.setDetail("n1");
        n1.setActive(ActiveStatus.Y);
        n1.setStatus(NotificationStatus.PENDING);

        Notification n2 = new Notification();
        n2.setDetail("n2");
        n2.setActive(ActiveStatus.N);
        n2.setStatus(NotificationStatus.SENT);

        repository.save(n1);
        repository.save(n2);

        assertEquals(1, repository.findByActive(ActiveStatus.Y).size());
        assertEquals(1, repository.findByStatus(NotificationStatus.SENT).size());
        assertEquals(0, repository.findByStatusAndActive(NotificationStatus.SENT, ActiveStatus.Y).size());
    }
}
