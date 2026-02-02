package com.td.plra.common;

import com.td.plra.persistence.entity.*;
import com.td.plra.persistence.enums.*;
import com.td.plra.service.amounttier.dto.AmountTierAdminView;
import com.td.plra.service.amounttier.dto.AmountTierInput;
import com.td.plra.service.amounttier.dto.AmountTierUserView;
import com.td.plra.service.category.dto.CategoryAdminView;
import com.td.plra.service.category.dto.CategoryInput;
import com.td.plra.service.category.dto.CategoryUserView;
import com.td.plra.service.cvpcode.dto.CvpCodeAdminView;
import com.td.plra.service.cvpcode.dto.CvpCodeInput;
import com.td.plra.service.cvpcode.dto.CvpCodeUserView;
import com.td.plra.service.notification.dto.NotificationAdminView;
import com.td.plra.service.notification.dto.NotificationInput;
import com.td.plra.service.prime.dto.PrimeAdminView;
import com.td.plra.service.prime.dto.PrimeInput;
import com.td.plra.service.product.dto.ProductAdminView;
import com.td.plra.service.product.dto.ProductInput;
import com.td.plra.service.product.dto.ProductUserView;
import com.td.plra.service.rateiloc.dto.RateIlocAdminView;
import com.td.plra.service.rateiloc.dto.RateIlocInput;
import com.td.plra.service.rateuloc.dto.RateUlocAdminView;
import com.td.plra.service.rateuloc.dto.RateUlocInput;
import com.td.plra.service.subcategory.dto.SubCategoryAdminView;
import com.td.plra.service.subcategory.dto.SubCategoryInput;
import com.td.plra.service.subcategory.dto.SubCategoryUserView;
import com.td.plra.service.workflow.dto.WorkflowAdminView;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Test fixtures factory for creating test data consistently across all test classes.
 */
public final class TestFixtures {
    
    private TestFixtures() {
        // Utility class
    }
    
    // ============================================================
    // PRODUCT FIXTURES
    // ============================================================
    
    public static Product createProduct() {
        return createProduct(1L, "Test Product");
    }
    
    public static Product createProduct(Long id, String name) {
        Product product = new Product();
        product.setId(id);
        product.setName(name);
        product.setType("LENDING");
        product.setSecurityCode("SEC001");
        product.setDetail("Test product detail");
        product.setActive(ActiveStatus.Y);
        product.setCreatedBy("test-user");
        product.setCreatedOn(LocalDateTime.now());
        product.setUpdatedBy("test-user");
        product.setUpdatedOn(LocalDateTime.now());
        product.setVersion(1L);
        return product;
    }
    
    public static ProductInput createProductInput() {
        return ProductInput.builder()
                .name("Test Product")
                .type("LENDING")
                .securityCode("SEC001")
                .detail("Test product detail")
                .build();
    }
    
    public static ProductAdminView createProductAdminView() {
        return createProductAdminView(1L, "Test Product");
    }
    
    public static ProductAdminView createProductAdminView(Long id, String name) {
        return ProductAdminView.builder()
                .id(id)
                .name(name)
                .type("LENDING")
                .securityCode("SEC001")
                .detail("Test product detail")
                .active(true)
                .createdBy("test-user")
                .createdOn(LocalDateTime.now())
                .updatedBy("test-user")
                .updatedOn(LocalDateTime.now())
                .version(1L)
                .build();
    }
    
    public static ProductUserView createProductUserView() {
        return ProductUserView.builder()
                .id(1L)
                .name("Test Product")
                .type("LENDING")
                .securityCode("SEC001")
                .detail("Test product detail")
                .build();
    }
    
    // ============================================================
    // CATEGORY FIXTURES
    // ============================================================
    
    public static Category createCategory() {
        return createCategory(1L, "Test Category", createProduct());
    }
    
    public static Category createCategory(Long id, String name, Product product) {
        Category category = new Category();
        category.setId(id);
        category.setName(name);
        category.setDetail("Test category detail");
        category.setProduct(product);
        category.setActive(ActiveStatus.Y);
        category.setCreatedBy("test-user");
        category.setCreatedOn(LocalDateTime.now());
        category.setUpdatedBy("test-user");
        category.setUpdatedOn(LocalDateTime.now());
        category.setVersion(1L);
        return category;
    }
    
    public static CategoryInput createCategoryInput() {
        return CategoryInput.builder()
                .name("Test Category")
                .detail("Test category detail")
                .productId(1L)
                .build();
    }
    
    public static CategoryAdminView createCategoryAdminView() {
        return CategoryAdminView.builder()
                .id(1L)
                .name("Test Category")
                .detail("Test category detail")
                .product(createProductUserView())
                .active(true)
                .createdBy("test-user")
                .createdOn(LocalDateTime.now())
                .version(1L)
                .build();
    }
    
    public static CategoryUserView createCategoryUserView() {
        return CategoryUserView.builder()
                .id(1L)
                .name("Test Category")
                .detail("Test category detail")
                .build();
    }
    
    // ============================================================
    // SUBCATEGORY FIXTURES
    // ============================================================
    
    public static SubCategory createSubCategory() {
        return createSubCategory(1L, "Test SubCategory", createCategory());
    }
    
    public static SubCategory createSubCategory(Long id, String name, Category category) {
        SubCategory subCategory = new SubCategory();
        subCategory.setId(id);
        subCategory.setName(name);
        subCategory.setDetail("Test subcategory detail");
        subCategory.setCategory(category);
        subCategory.setActive(ActiveStatus.Y);
        subCategory.setCreatedBy("test-user");
        subCategory.setCreatedOn(LocalDateTime.now());
        subCategory.setUpdatedBy("test-user");
        subCategory.setUpdatedOn(LocalDateTime.now());
        subCategory.setVersion(1L);
        return subCategory;
    }
    
    public static SubCategoryInput createSubCategoryInput() {
        return SubCategoryInput.builder()
                .name("Test SubCategory")
                .detail("Test subcategory detail")
                .categoryId(1L)
                .build();
    }
    
    public static SubCategoryAdminView createSubCategoryAdminView() {
        return SubCategoryAdminView.builder()
                .id(1L)
                .name("Test SubCategory")
                .detail("Test subcategory detail")
                .category(createCategoryUserView())
                .active(true)
                .createdBy("test-user")
                .createdOn(LocalDateTime.now())
                .version(1L)
                .build();
    }
    
    public static SubCategoryUserView createSubCategoryUserView() {
        return SubCategoryUserView.builder()
                .id(1L)
                .name("Test SubCategory")
                .detail("Test subcategory detail")
                .build();
    }
    
    // ============================================================
    // CVP CODE FIXTURES
    // ============================================================
    
    public static CvpCode createCvpCode() {
        return createCvpCode(1L, "CVP001", createSubCategory());
    }
    
    public static CvpCode createCvpCode(Long id, String name, SubCategory subCategory) {
        CvpCode cvpCode = new CvpCode();
        cvpCode.setId(id);
        cvpCode.setName(name);
        cvpCode.setDetail("Test CVP code detail");
        cvpCode.setSubCategory(subCategory);
        cvpCode.setActive(ActiveStatus.Y);
        cvpCode.setCreatedBy("test-user");
        cvpCode.setCreatedOn(LocalDateTime.now());
        cvpCode.setUpdatedBy("test-user");
        cvpCode.setUpdatedOn(LocalDateTime.now());
        cvpCode.setVersion(1L);
        return cvpCode;
    }
    
    public static CvpCodeInput createCvpCodeInput() {
        return CvpCodeInput.builder()
                .name("CVP001")
                .detail("Test CVP code detail")
                .subCategoryId(1L)
                .build();
    }
    
    public static CvpCodeAdminView createCvpCodeAdminView() {
        return CvpCodeAdminView.builder()
                .id(1L)
                .name("CVP001")
                .detail("Test CVP code detail")
                .category(createCategoryUserView())
                .subCategory(createSubCategoryUserView())
                .active(true)
                .createdBy("test-user")
                .createdOn(LocalDateTime.now())
                .version(1L)
                .build();
    }
    
    public static CvpCodeUserView createCvpCodeUserView() {
        return CvpCodeUserView.builder()
                .id(1L)
                .name("CVP001")
                .detail("Test CVP code detail")
                .build();
    }
    
    // ============================================================
    // AMOUNT TIER FIXTURES
    // ============================================================
    
    public static AmountTier createAmountTier() {
        return createAmountTier(1L, "Tier 1", createProduct());
    }
    
    public static AmountTier createAmountTier(Long id, String name, Product product) {
        AmountTier tier = new AmountTier();
        tier.setId(id);
        tier.setName(name);
        tier.setDetail("Test tier detail");
        tier.setMin(new BigDecimal("0"));
        tier.setMax(new BigDecimal("100000"));
        tier.setProduct(product);
        tier.setActive(ActiveStatus.Y);
        tier.setCreatedBy("test-user");
        tier.setCreatedOn(LocalDateTime.now());
        tier.setUpdatedBy("test-user");
        tier.setUpdatedOn(LocalDateTime.now());
        tier.setVersion(1L);
        return tier;
    }
    
    public static AmountTierInput createAmountTierInput() {
        return AmountTierInput.builder()
                .name("Tier 1")
                .detail("Test tier detail")
                .min(new BigDecimal("0"))
                .max(new BigDecimal("100000"))
                .productId(1L)
                .build();
    }
    
    public static AmountTierAdminView createAmountTierAdminView() {
        return AmountTierAdminView.builder()
                .id(1L)
                .name("Tier 1")
                .detail("Test tier detail")
                .min(new BigDecimal("0"))
                .max(new BigDecimal("100000"))
                .product(createProductUserView())
                .active(true)
                .createdBy("test-user")
                .createdOn(LocalDateTime.now())
                .version(1L)
                .build();
    }
    
    public static AmountTierUserView createAmountTierUserView() {
        return AmountTierUserView.builder()
                .id(1L)
                .name("Tier 1")
                .detail("Test tier detail")
                .min(new BigDecimal("0"))
                .max(new BigDecimal("100000"))
                .build();
    }
    
    // ============================================================
    // PRIME FIXTURES
    // ============================================================
    
    public static Prime createPrime() {
        return createPrime(1L, new BigDecimal("5.25"));
    }
    
    public static Prime createPrime(Long id, BigDecimal rate) {
        Prime prime = new Prime();
        prime.setId(id);
        prime.setRate(rate);
        prime.setDetail("Test prime rate");
        prime.setActive(ActiveStatus.Y);
        prime.setCreatedBy("test-user");
        prime.setCreatedOn(LocalDateTime.now());
        prime.setUpdatedBy("test-user");
        prime.setUpdatedOn(LocalDateTime.now());
        prime.setVersion(1L);
        return prime;
    }
    
    public static PrimeInput createPrimeInput() {
        return PrimeInput.builder()
                .rate(new BigDecimal("5.25"))
                .detail("Test prime rate")
                .build();
    }
    
    public static PrimeAdminView createPrimeAdminView() {
        return PrimeAdminView.builder()
                .id(1L)
                .rate(new BigDecimal("5.25"))
                .detail("Test prime rate")
                .active(true)
                .createdBy("test-user")
                .createdOn(LocalDateTime.now())
                .version(1L)
                .build();
    }
    
    // ============================================================
    // NOTIFICATION FIXTURES
    // ============================================================
    
    public static Notification createNotification() {
        return createNotification(1L, NotificationStatus.PENDING);
    }
    
    public static Notification createNotification(Long id, NotificationStatus status) {
        Notification notification = new Notification();
        notification.setId(id);
        notification.setDetail("Test notification");
        notification.setStatus(status);
        notification.setActive(ActiveStatus.Y);
        notification.setCreatedBy("test-user");
        notification.setCreatedOn(LocalDateTime.now());
        notification.setUpdatedBy("test-user");
        notification.setUpdatedOn(LocalDateTime.now());
        notification.setVersion(1L);
        return notification;
    }
    
    public static NotificationInput createNotificationInput() {
        return NotificationInput.builder()
                .detail("Test notification")
                .status(NotificationStatus.PENDING)
                .build();
    }
    
    public static NotificationAdminView createNotificationAdminView() {
        return NotificationAdminView.builder()
                .id(1L)
                .detail("Test notification")
                .status(NotificationStatus.PENDING)
                .active(true)
                .createdBy("test-user")
                .createdOn(LocalDateTime.now())
                .version(1L)
                .build();
    }
    
    // ============================================================
    // WORKFLOW FIXTURES
    // ============================================================
    
    public static Workflow createWorkflow() {
        return createWorkflow(1L, RateType.ILOC, WorkflowAction.CREATE);
    }
    
    public static Workflow createWorkflow(Long id, RateType rateType, WorkflowAction action) {
        Workflow workflow = new Workflow();
        workflow.setId(id);
        workflow.setRateType(rateType);
        workflow.setRateStatus(RateStatus.DRAFT);
        workflow.setRateId(1L);
        workflow.setChangeId("CHG-TEST-001");
        workflow.setAction(action);
        workflow.setChangeBy("test-user");
        workflow.setChangeOn(LocalDateTime.now());
        workflow.setFromStatus(null);
        workflow.setToStatus(RateStatus.DRAFT);
        workflow.setActive(ActiveStatus.Y);
        workflow.setCreatedBy("test-user");
        workflow.setCreatedOn(LocalDateTime.now());
        workflow.setUpdatedBy("test-user");
        workflow.setUpdatedOn(LocalDateTime.now());
        workflow.setVersion(1L);
        return workflow;
    }
    
    public static WorkflowAdminView createWorkflowAdminView() {
        return WorkflowAdminView.builder()
                .id(1L)
                .rateType(RateType.ILOC)
                .rateStatus(RateStatus.DRAFT)
                .rateId(1L)
                .changeId("CHG-TEST-001")
                .action(WorkflowAction.CREATE)
                .changeBy("test-user")
                .changeOn(LocalDateTime.now())
                .fromStatus(null)
                .toStatus(RateStatus.DRAFT)
                .active(true)
                .createdBy("test-user")
                .createdOn(LocalDateTime.now())
                .version(1L)
                .build();
    }
    
    // ============================================================
    // RATE ILOC FIXTURES
    // ============================================================
    
    public static RateIlocDraft createRateIlocDraft() {
        return createRateIlocDraft(1L, RateStatus.DRAFT);
    }
    
    public static RateIlocDraft createRateIlocDraft(Long id, RateStatus status) {
        RateIlocDraft rate = new RateIlocDraft();
        rate.setId(id);
        rate.setAmountTier(createAmountTier());
        rate.setSubCategory(createSubCategory());
        rate.setDetail("Test ILOC rate");
        rate.setTargetRate(new BigDecimal("7.50"));
        rate.setFloorRate(new BigDecimal("5.00"));
        rate.setDiscretion(new BigDecimal("0.50"));
        rate.setStartDate(LocalDate.now());
        rate.setExpiryDate(LocalDate.now().plusYears(1));
        rate.setStatus(status);
        rate.setNotes("Test notes");
        rate.setChangeId("CHG-ILOC-TEST001");
        rate.setActive(ActiveStatus.Y);
        rate.setCreatedBy("test-user");
        rate.setCreatedOn(LocalDateTime.now());
        rate.setUpdatedBy("test-user");
        rate.setUpdatedOn(LocalDateTime.now());
        rate.setVersion(1L);
        return rate;
    }
    
    public static RateIlocActive createRateIlocActive() {
        RateIlocActive rate = new RateIlocActive();
        rate.setId(1L);
        rate.setAmountTier(createAmountTier());
        rate.setSubCategory(createSubCategory());
        rate.setDetail("Test ILOC rate");
        rate.setTargetRate(new BigDecimal("7.50"));
        rate.setFloorRate(new BigDecimal("5.00"));
        rate.setDiscretion(new BigDecimal("0.50"));
        rate.setStartDate(LocalDate.now());
        rate.setExpiryDate(LocalDate.now().plusYears(1));
        rate.setStatus(RateStatus.ACTIVE);
        rate.setChangeId("CHG-ILOC-TEST001");
        rate.setActive(ActiveStatus.Y);
        rate.setCreatedBy("test-user");
        rate.setCreatedOn(LocalDateTime.now());
        rate.setVersion(1L);
        return rate;
    }
    
    public static RateIlocHistory createRateIlocHistory() {
        RateIlocHistory rate = new RateIlocHistory();
        rate.setId(1L);
        rate.setAmountTier(createAmountTier());
        rate.setSubCategory(createSubCategory());
        rate.setDetail("Test ILOC rate");
        rate.setTargetRate(new BigDecimal("7.50"));
        rate.setFloorRate(new BigDecimal("5.00"));
        rate.setStartDate(LocalDate.now().minusYears(1));
        rate.setExpiryDate(LocalDate.now());
        rate.setStatus(RateStatus.EXPIRED);
        rate.setChangeId("CHG-ILOC-TEST001");
        rate.setActive(ActiveStatus.Y);
        rate.setCreatedBy("test-user");
        rate.setCreatedOn(LocalDateTime.now().minusYears(1));
        rate.setVersion(1L);
        return rate;
    }
    
    public static RateIlocInput createRateIlocInput() {
        return RateIlocInput.builder()
                .amountTierId(1L)
                .subCategoryId(1L)
                .detail("Test ILOC rate")
                .targetRate(new BigDecimal("7.50"))
                .floorRate(new BigDecimal("5.00"))
                .discretion(new BigDecimal("0.50"))
                .startDate(LocalDate.now())
                .expiryDate(LocalDate.now().plusYears(1))
                .notes("Test notes")
                .build();
    }
    
    public static RateIlocAdminView createRateIlocAdminView() {
        return createRateIlocAdminView(1L, RateStatus.DRAFT, "DRAFT");
    }
    
    public static RateIlocAdminView createRateIlocAdminView(Long id, RateStatus status, String source) {
        return RateIlocAdminView.builder()
                .id(id)
                .amountTier(createAmountTierUserView())
                .subCategory(createSubCategoryUserView())
                .detail("Test ILOC rate")
                .targetRate(new BigDecimal("7.50"))
                .floorRate(new BigDecimal("5.00"))
                .discretion(new BigDecimal("0.50"))
                .startDate(LocalDate.now())
                .expiryDate(LocalDate.now().plusYears(1))
                .status(status)
                .notes("Test notes")
                .changeId("CHG-ILOC-TEST001")
                .source(source)
                .active(true)
                .createdBy("test-user")
                .createdOn(LocalDateTime.now())
                .version(1L)
                .build();
    }
    
    // ============================================================
    // RATE ULOC FIXTURES
    // ============================================================
    
    public static RateUlocDraft createRateUlocDraft() {
        return createRateUlocDraft(1L, RateStatus.DRAFT);
    }
    
    public static RateUlocDraft createRateUlocDraft(Long id, RateStatus status) {
        RateUlocDraft rate = new RateUlocDraft();
        rate.setId(id);
        rate.setCvpCode(createCvpCode());
        rate.setAmountTier(createAmountTier());
        rate.setDetail("Test ULOC rate");
        rate.setTargetRate(new BigDecimal("8.50"));
        rate.setFloorRate(new BigDecimal("6.00"));
        rate.setDiscretion(new BigDecimal("0.75"));
        rate.setStartDate(LocalDate.now());
        rate.setExpiryDate(LocalDate.now().plusYears(1));
        rate.setStatus(status);
        rate.setNotes("Test notes");
        rate.setChangeId("CHG-ULOC-TEST001");
        rate.setActive(ActiveStatus.Y);
        rate.setCreatedBy("test-user");
        rate.setCreatedOn(LocalDateTime.now());
        rate.setUpdatedBy("test-user");
        rate.setUpdatedOn(LocalDateTime.now());
        rate.setVersion(1L);
        return rate;
    }
    
    public static RateUlocInput createRateUlocInput() {
        return RateUlocInput.builder()
                .cvpCodeId(1L)
                .amountTierId(1L)
                .detail("Test ULOC rate")
                .targetRate(new BigDecimal("8.50"))
                .floorRate(new BigDecimal("6.00"))
                .discretion(new BigDecimal("0.75"))
                .startDate(LocalDate.now())
                .expiryDate(LocalDate.now().plusYears(1))
                .notes("Test notes")
                .build();
    }
    
    public static RateUlocAdminView createRateUlocAdminView() {
        return RateUlocAdminView.builder()
                .id(1L)
                .cvpCode(createCvpCodeUserView())
                .amountTier(createAmountTierUserView())
                .detail("Test ULOC rate")
                .targetRate(new BigDecimal("8.50"))
                .floorRate(new BigDecimal("6.00"))
                .discretion(new BigDecimal("0.75"))
                .startDate(LocalDate.now())
                .expiryDate(LocalDate.now().plusYears(1))
                .status(RateStatus.DRAFT)
                .notes("Test notes")
                .changeId("CHG-ULOC-TEST001")
                .source("DRAFT")
                .active(true)
                .createdBy("test-user")
                .createdOn(LocalDateTime.now())
                .version(1L)
                .build();
    }
}
