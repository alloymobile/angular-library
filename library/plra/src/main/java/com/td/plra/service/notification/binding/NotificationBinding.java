package com.td.plra.service.notification.binding;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.td.plra.application.utils.BaseBinding;
import com.td.plra.persistence.entity.QNotification;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.NotificationStatus;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class NotificationBinding extends BaseBinding {
    
    private static final QNotification notification = QNotification.notification;
    
    public BooleanExpression buildPredicate(Map<String, String> params) {
        BooleanExpression predicate = null;
        
        if (hasParam(params, "status")) {
            NotificationStatus status = NotificationStatus.valueOf(getParam(params, "status").toUpperCase());
            predicate = and(predicate, notification.status.eq(status));
        }
        
        if (hasParam(params, "active")) {
            ActiveStatus status = ActiveStatus.valueOf(getParam(params, "active").toUpperCase());
            predicate = and(predicate, notification.active.eq(status));
        } else {
            predicate = and(predicate, notification.active.eq(ActiveStatus.Y));
        }
        
        predicate = and(predicate, dateRange(params, "createdFrom", "createdTo",
                (start, end) -> notification.createdOn.between(start, end)));
        
        return predicate;
    }
}
