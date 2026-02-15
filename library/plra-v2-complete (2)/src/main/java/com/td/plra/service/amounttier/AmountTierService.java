package com.td.plra.service.amounttier;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.td.plra.application.exception.BadRequestException;
import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.persistence.entity.AmountTier;
import com.td.plra.persistence.entity.Product;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.repository.AmountTierRepository;
import com.td.plra.service.amounttier.binding.AmountTierBinding;
import com.td.plra.service.amounttier.dto.AmountTierAdminView;
import com.td.plra.service.amounttier.dto.AmountTierInput;
import com.td.plra.service.amounttier.mapper.AmountTierMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * Service layer for AmountTier CRUD operations.
 * <p>
 * <b>v2.0 Changes:</b>
 * <ul>
 *   <li>{@link #create(AmountTierInput, Product)} accepts Product from resource (resolved from {productName})</li>
 *   <li>{@link #update(Long, AmountTierInput, Product)} accepts Product from resource</li>
 *   <li>Min/max validation aligned with DB2 CHK_AMOUNT_TIER_RANGE (MIN &lt;= MAX)</li>
 * </ul>
 * </p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AmountTierService {

    private static final String ENTITY_NAME = "AmountTier";

    private final AmountTierRepository repository;
    private final AmountTierMapper mapper;
    private final AmountTierBinding binding;

    // ============================================================
    // CREATE
    // ============================================================

    @Transactional
    public AmountTierAdminView create(AmountTierInput input, Product product) {
        log.info("Creating new amount tier: name={}, productId={}, productName={}, min={}, max={}",
                input.getName(), product.getId(), product.getName(), input.getMin(), input.getMax());

        validateMinMax(input);

        AmountTier entity = mapper.toEntity(input);
        entity.setProduct(product);
        entity = repository.save(entity);

        log.info("Amount tier created successfully: id={}, name={}, product={}, range=[{}-{}]",
                entity.getId(), entity.getName(), product.getName(), entity.getMin(), entity.getMax());
        return mapper.toAdminView(entity);
    }

    // ============================================================
    // READ
    // ============================================================

    public AmountTierAdminView findById(Long id) {
        log.debug("Finding amount tier by id={}", id);
        AmountTier entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
        return mapper.toAdminView(entity);
    }

    public PageResponse<AmountTierAdminView> findAll(Map<String, String> params, Pageable pageable) {
        log.debug("Finding all amount tiers with params: {}", params);

        BooleanExpression predicate = binding.buildPredicate(params);

        Page<AmountTier> page;
        if (predicate != null) {
            page = repository.findAll(predicate, pageable);
        } else {
            page = repository.findAll(pageable);
        }

        List<AmountTierAdminView> content = mapper.toAdminViewList(page.getContent());
        return PageResponse.from(page, content);
    }

    // ============================================================
    // UPDATE
    // ============================================================

    @Transactional
    public AmountTierAdminView update(Long id, AmountTierInput input, Product product) {
        log.info("Updating amount tier: id={}, productName={}", id, product.getName());

        AmountTier entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));

        // Validate min/max only if both are provided (for PATCH, one might be null)
        if (input.getMin() != null && input.getMax() != null) {
            validateMinMax(input);
        } else if (input.getMin() != null && input.getMin().compareTo(entity.getMax()) > 0) {
            log.warn("Amount tier min > existing max: id={}, newMin={}, existingMax={}", id, input.getMin(), entity.getMax());
            throw new BadRequestException("min", "Minimum amount must be less than or equal to maximum amount");
        } else if (input.getMax() != null && entity.getMin().compareTo(input.getMax()) > 0) {
            log.warn("Existing min > new max: id={}, existingMin={}, newMax={}", id, entity.getMin(), input.getMax());
            throw new BadRequestException("max", "Maximum amount must be greater than or equal to minimum amount");
        }

        if (!entity.getProduct().getId().equals(product.getId())) {
            log.info("Amount tier product changed: id={}, oldProduct={}, newProduct={}",
                    id, entity.getProduct().getName(), product.getName());
            entity.setProduct(product);
        }

        mapper.updateEntity(input, entity);
        entity = repository.save(entity);

        log.info("Amount tier updated successfully: id={}, name={}, range=[{}-{}]",
                entity.getId(), entity.getName(), entity.getMin(), entity.getMax());
        return mapper.toAdminView(entity);
    }

    // ============================================================
    // DELETE / REACTIVATE
    // ============================================================

    @Transactional
    public void delete(Long id) {
        log.info("Soft deleting amount tier: id={}", id);
        AmountTier entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
        entity.setActive(ActiveStatus.N);
        repository.save(entity);
        log.info("Amount tier soft deleted successfully: id={}, name={}", entity.getId(), entity.getName());
    }

    @Transactional
    public AmountTierAdminView reactivate(Long id) {
        log.info("Reactivating amount tier: id={}", id);
        AmountTier entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
        entity.setActive(ActiveStatus.Y);
        entity = repository.save(entity);
        log.info("Amount tier reactivated successfully: id={}, name={}", entity.getId(), entity.getName());
        return mapper.toAdminView(entity);
    }

    // ============================================================
    // INTERNAL ACCESSORS
    // ============================================================

    public boolean existsById(Long id) {
        return repository.existsById(id);
    }

    public AmountTier getEntityById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
    }

    // ============================================================
    // PRIVATE HELPERS
    // ============================================================

    /**
     * Validates that min &lt;= max (aligned with DB2 CHK_AMOUNT_TIER_RANGE).
     */
    private void validateMinMax(AmountTierInput input) {
        if (input.getMin().compareTo(input.getMax()) > 0) {
            log.warn("Amount tier validation failed: min={} > max={}", input.getMin(), input.getMax());
            throw new BadRequestException("min", "Minimum amount must be less than or equal to maximum amount");
        }
    }
}
