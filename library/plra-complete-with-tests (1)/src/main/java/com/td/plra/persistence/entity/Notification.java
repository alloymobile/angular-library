package com.td.plra.persistence.entity;

import com.td.plra.application.utils.BaseAuditable;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.NotificationStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "PLRA_NOTIFICATION")
@EntityListeners(AuditingEntityListener.class)
public class Notification extends BaseAuditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "DETAIL")
    private String detail;

    @Enumerated(EnumType.STRING)
    @Column(name = "ACTIVE", nullable = false, length = 1)
    private ActiveStatus active;

    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", nullable = false)
    private NotificationStatus status;
}
