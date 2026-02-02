package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.Notification;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.NotificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long>, QuerydslPredicateExecutor<Notification> {

    List<Notification> findByActive(ActiveStatus active);

    List<Notification> findByStatus(NotificationStatus status);

    List<Notification> findByStatusAndActive(NotificationStatus status, ActiveStatus active);
}
