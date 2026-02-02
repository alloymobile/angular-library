package com.td.plra.service.notification;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.persistence.entity.Notification;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.NotificationStatus;
import com.td.plra.persistence.repository.NotificationRepository;
import com.td.plra.service.notification.binding.NotificationBinding;
import com.td.plra.service.notification.dto.NotificationAdminView;
import com.td.plra.service.notification.dto.NotificationInput;
import com.td.plra.service.notification.mapper.NotificationMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationService {
    
    private static final String ENTITY_NAME = "Notification";
    
    private final NotificationRepository repository;
    private final NotificationMapper mapper;
    private final NotificationBinding binding;
    
    @Transactional
    public NotificationAdminView create(NotificationInput input) {
        log.info("Creating new notification");
        
        Notification entity = mapper.toEntity(input);
        entity = repository.save(entity);
        
        log.info("Notification created successfully with id: {}", entity.getId());
        return mapper.toAdminView(entity);
    }
    
    public NotificationAdminView findById(Long id) {
        log.debug("Finding notification by id: {}", id);
        
        Notification entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
        
        return mapper.toAdminView(entity);
    }
    
    public PageResponse<NotificationAdminView> findAll(Map<String, String> params, Pageable pageable) {
        log.debug("Finding all notifications with params: {}", params);
        
        BooleanExpression predicate = binding.buildPredicate(params);
        
        Page<Notification> page;
        if (predicate != null) {
            page = repository.findAll(predicate, pageable);
        } else {
            page = repository.findAll(pageable);
        }
        
        List<NotificationAdminView> content = mapper.toAdminViewList(page.getContent());
        return PageResponse.from(page, content);
    }
    
    @Transactional
    public NotificationAdminView update(Long id, NotificationInput input) {
        log.info("Updating notification with id: {}", id);
        
        Notification entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
        
        mapper.updateEntity(input, entity);
        entity = repository.save(entity);
        
        log.info("Notification updated successfully with id: {}", entity.getId());
        return mapper.toAdminView(entity);
    }
    
    @Transactional
    public NotificationAdminView updateStatus(Long id, NotificationStatus status) {
        log.info("Updating notification status to {} for id: {}", status, id);
        
        Notification entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
        
        entity.setStatus(status);
        entity = repository.save(entity);
        
        log.info("Notification status updated successfully with id: {}", entity.getId());
        return mapper.toAdminView(entity);
    }
    
    @Transactional
    public void delete(Long id) {
        log.info("Soft deleting notification with id: {}", id);
        
        Notification entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
        
        entity.setActive(ActiveStatus.N);
        repository.save(entity);
        
        log.info("Notification soft deleted successfully with id: {}", id);
    }
    
    public Notification getEntityById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
    }
}
