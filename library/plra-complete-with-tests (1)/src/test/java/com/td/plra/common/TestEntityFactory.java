package com.td.plra.common;

import com.fasterxml.jackson.databind.JsonNode;
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
 * Factory class to create test entities and DTOs from JSON test data.
 * All entities are created with proper relationships for unit testing.
 */
public final class TestEntityFactory {
    
    private static final String TEST_USER = "test-user";
    private static final LocalDateTime NOW = LocalDateTime.now();
    
    private TestEntityFactory() {
        // Utility class
    }
    
    // ============================================================
    // PRODUCT
    // ============================================================
    
    public static Product createProduct() {
        return createProduct(1L);
    }
    
    public static Product createProduct(Long id) {
        JsonNode data = TestDataLoader.getProducts().get(0);
        Product product = new Product();
        product.setId(id);
        product.setName(data.get("name").asText());
        product.setType(data.get("type").asText());
        product.setSecurityCode(data.get("securityCode").asText());
        product.setDetail(data.get("detail").asText());
        product.setActive(ActiveStatus.valueOf(data.get("active").asText()));
        product.setCreatedOn(NOW);
        product.setCreatedBy(TEST_USER);
        return product;
    }
    
    public static ProductInput createProductInput() {
        JsonNode data = TestDataLoader.getProducts().get(0);
        return ProductInput.builder()
                .name(data.get("name").asText())
                .type(data.get("type").asText())
                .securityCode(data.get("securityCode").asText())
                .detail(data.get("detail").asText())
                .build();
    }
    
    public static ProductAdminView createProductAdminView() {
        return createProductAdminView(1L);
    }
    
    public static ProductAdminView createProductAdminView(Long id) {
        JsonNode data = TestDataLoader.getProducts().get(0);
        return ProductAdminView.builder()
                .id(id)
                .name(data.get("name").asText())
                .type(data.get("type").asText())
                .securityCode(data.get("securityCode").asText())
                .detail(data.get("detail").asText())
                .active(true)
                .createdOn(NOW)
                .createdBy(TEST_USER)
                .build();
    }
    
    // ============================================================
    // CATEGORY
    // ============================================================
    
    public static Category createCategory() {
        return createCategory(1L);
    }
    
    public static Category createCategory(Long id) {
        JsonNode data = TestDataLoader.getCategories().get(0);
        Category category = new Category();
        category.setId(id);
        category.setName(data.get("name").asText());
        category.setDetail(data.get("detail").asText());
        category.setProduct(createProduct());
        category.setActive(ActiveStatus.valueOf(data.get("active").asText()));
        category.setCreatedOn(NOW);
        category.setCreatedBy(TEST_USER);
        return category;
    }
    
    public static CategoryInput createCategoryInput() {
        JsonNode data = TestDataLoader.getCategories().get(0);
        return CategoryInput.builder()
                .name(data.get("name").asText())
                .detail(data.get("detail").asText())
                .productId(data.get("productId").asLong())
                .build();
    }
    
    public static CategoryAdminView createCategoryAdminView() {
        return createCategoryAdminView(1L);
    }
    
    public static CategoryAdminView createCategoryAdminView(Long id) {
        JsonNode data = TestDataLoader.getCategories().get(0);
        return CategoryAdminView.builder()
                .id(id)
                .name(data.get("name").asText())
                .detail(data.get("detail").asText())
                .active(true)
                .createdOn(NOW)
                .createdBy(TEST_USER)
                .build();
    }
    
    public static CategoryUserView createCategoryUserView() {
        JsonNode data = TestDataLoader.getCategories().get(0);
        return CategoryUserView.builder()
                .id(1L)
                .name(data.get("name").asText())
                .detail(data.get("detail").asText())
                .build();
    }
    
    // ============================================================
    // SUBCATEGORY
    // ============================================================
    
    public static SubCategory createSubCategory() {
        return createSubCategory(1L);
    }
    
    public static SubCategory createSubCategory(Long id) {
        JsonNode data = TestDataLoader.getSubCategories().get(0);
        SubCategory subCategory = new SubCategory();
        subCategory.setId(id);
        subCategory.setName(data.get("name").asText());
        subCategory.setDetail(data.get("detail").asText());
        subCategory.setCategory(createCategory());
        subCategory.setActive(ActiveStatus.valueOf(data.get("active").asText()));
        subCategory.setCreatedOn(NOW);
        subCategory.setCreatedBy(TEST_USER);
        return subCategory;
    }
    
    public static SubCategoryInput createSubCategoryInput() {
        JsonNode data = TestDataLoader.getSubCategories().get(0);
        return SubCategoryInput.builder()
                .name(data.get("name").asText())
                .detail(data.get("detail").asText())
                .categoryId(data.get("categoryId").asLong())
                .build();
    }
    
    public static SubCategoryAdminView createSubCategoryAdminView() {
        return createSubCategoryAdminView(1L);
    }
    
    public static SubCategoryAdminView createSubCategoryAdminView(Long id) {
        JsonNode data = TestDataLoader.getSubCategories().get(0);
        return SubCategoryAdminView.builder()
                .id(id)
                .name(data.get("name").asText())
                .detail(data.get("detail").asText())
                .active(true)
                .createdOn(NOW)
                .createdBy(TEST_USER)
                .build();
    }
    
    public static SubCategoryUserView createSubCategoryUserView() {
        JsonNode data = TestDataLoader.getSubCategories().get(0);
        return SubCategoryUserView.builder()
                .id(1L)
                .name(data.get("name").asText())
                .detail(data.get("detail").asText())
                .build();
    }
    
    // ============================================================
    // AMOUNT TIER
    // ============================================================
    
    public static AmountTier createAmountTier() {
        return createAmountTier(1L);
    }
    
    public static AmountTier createAmountTier(Long id) {
        JsonNode data = TestDataLoader.getAmountTiers().get(0);
        AmountTier tier = new AmountTier();
        tier.setId(id);
        tier.setName(data.get("name").asText());
        tier.setDetail(data.get("detail").asText());
        tier.setMin(new BigDecimal(data.get("min").asInt()));
        tier.setMax(new BigDecimal(data.get("max").asInt()));
        tier.setProduct(createProduct());
        tier.setActive(ActiveStatus.valueOf(data.get("active").asText()));
        tier.setCreatedOn(NOW);
        tier.setCreatedBy(TEST_USER);
        return tier;
    }
    
    public static AmountTierInput createAmountTierInput() {
        JsonNode data = TestDataLoader.getAmountTiers().get(0);
        return AmountTierInput.builder()
                .name(data.get("name").asText())
                .detail(data.get("detail").asText())
                .min(new BigDecimal(data.get("min").asInt()))
                .max(new BigDecimal(data.get("max").asInt()))
                .productId(data.get("productId").asLong())
                .build();
    }
    
    public static AmountTierAdminView createAmountTierAdminView() {
        return createAmountTierAdminView(1L);
    }
    
    public static AmountTierAdminView createAmountTierAdminView(Long id) {
        JsonNode data = TestDataLoader.getAmountTiers().get(0);
        return AmountTierAdminView.builder()
                .id(id)
                .name(data.get("name").asText())
                .detail(data.get("detail").asText())
                .min(new BigDecimal(data.get("min").asInt()))
                .max(new BigDecimal(data.get("max").asInt()))
                .active(true)
                .createdOn(NOW)
                .createdBy(TEST_USER)
                .build();
    }
    
    public static AmountTierUserView createAmountTierUserView() {
        JsonNode data = TestDataLoader.getAmountTiers().get(0);
        return AmountTierUserView.builder()
                .id(1L)
                .name(data.get("name").asText())
                .detail(data.get("detail").asText())
                .min(new BigDecimal(data.get("min").asInt()))
                .max(new BigDecimal(data.get("max").asInt()))
                .build();
    }
    
    // ============================================================
    // CVP CODE
    // ============================================================
    
    public static CvpCode createCvpCode() {
        return createCvpCode(1L);
    }
    
    public static CvpCode createCvpCode(Long id) {
        JsonNode data = TestDataLoader.getCvpCodes().get(0);
        CvpCode cvpCode = new CvpCode();
        cvpCode.setId(id);
        cvpCode.setName(data.get("name").asText());
        cvpCode.setDetail(data.get("detail").asText());
        cvpCode.setSubCategory(createSubCategory());
        cvpCode.setActive(ActiveStatus.valueOf(data.get("active").asText()));
        cvpCode.setCreatedOn(NOW);
        cvpCode.setCreatedBy(TEST_USER);
        return cvpCode;
    }
    
    public static CvpCodeInput createCvpCodeInput() {
        JsonNode data = TestDataLoader.getCvpCodes().get(0);
        return CvpCodeInput.builder()
                .name(data.get("name").asText())
                .detail(data.get("detail").asText())
                .subCategoryId(data.get("subCategoryId").asLong())
                .build();
    }
    
    public static CvpCodeAdminView createCvpCodeAdminView() {
        return createCvpCodeAdminView(1L);
    }
    
    public static CvpCodeAdminView createCvpCodeAdminView(Long id) {
        JsonNode data = TestDataLoader.getCvpCodes().get(0);
        return CvpCodeAdminView.builder()
                .id(id)
                .name(data.get("name").asText())
                .detail(data.get("detail").asText())
                .active(true)
                .createdOn(NOW)
                .createdBy(TEST_USER)
                .build();
    }
    
    public static CvpCodeUserView createCvpCodeUserView() {
        JsonNode data = TestDataLoader.getCvpCodes().get(0);
        return CvpCodeUserView.builder()
                .id(1L)
                .name(data.get("name").asText())
                .detail(data.get("detail").asText())
                .build();
    }
    
    // ============================================================
    // PRIME
    // ============================================================
    
    public static Prime createPrime() {
        return createPrime(1L);
    }
    
    public static Prime createPrime(Long id) {
        JsonNode data = TestDataLoader.getPrimes().get(0);
        Prime prime = new Prime();
        prime.setId(id);
        prime.setRate(new BigDecimal(data.get("rate").asText()));
        prime.setEffectiveDate(LocalDate.parse(data.get("effectiveDate").asText()));
        prime.setDetail(data.get("detail").asText());
        prime.setActive(ActiveStatus.valueOf(data.get("active").asText()));
        prime.setCreatedOn(NOW);
        prime.setCreatedBy(TEST_USER);
        return prime;
    }
    
    public static PrimeInput createPrimeInput() {
        JsonNode data = TestDataLoader.getPrimes().get(0);
        return PrimeInput.builder()
                .rate(new BigDecimal(data.get("rate").asText()))
                .effectiveDate(LocalDate.parse(data.get("effectiveDate").asText()))
                .detail(data.get("detail").asText())
                .build();
    }
    
    public static PrimeAdminView createPrimeAdminView() {
        return createPrimeAdminView(1L);
    }
    
    public static PrimeAdminView createPrimeAdminView(Long id) {
        JsonNode data = TestDataLoader.getPrimes().get(0);
        return PrimeAdminView.builder()
                .id(id)
                .rate(new BigDecimal(data.get("rate").asText()))
                .effectiveDate(LocalDate.parse(data.get("effectiveDate").asText()))
                .detail(data.get("detail").asText())
                .active(true)
                .createdOn(NOW)
                .createdBy(TEST_USER)
                .build();
    }
    
    // ============================================================
    // RATE ILOC
    // ============================================================
    
    public static RateIlocDraft createRateIlocDraft() {
        return createRateIlocDraft(1L, RateStatus.DRAFT);
    }
    
    public static RateIlocDraft createRateIlocDraft(Long id, RateStatus status) {
        JsonNode data = TestDataLoader.getRateIlocDrafts().get(0);
        RateIlocDraft draft = new RateIlocDraft();
        draft.setId(id);
        draft.setAmountTier(createAmountTier());
        draft.setSubCategory(createSubCategory());
        draft.setTargetRate(new BigDecimal(data.get("targetRate").asText()));
        draft.setFloorRate(new BigDecimal(data.get("floorRate").asText()));
        draft.setStartDate(LocalDate.parse(data.get("startDate").asText()));
        draft.setExpiryDate(LocalDate.parse(data.get("expiryDate").asText()));
        draft.setDetail(data.get("detail").asText());
        draft.setNotes(data.get("notes").asText());
        draft.setStatus(status);
        draft.setChangeId(data.get("changeId").asText());
        draft.setActive(ActiveStatus.valueOf(data.get("active").asText()));
        draft.setCreatedOn(NOW);
        draft.setCreatedBy(TEST_USER);
        return draft;
    }
    
    public static RateIlocActive createRateIlocActive() {
        return createRateIlocActive(1L, RateStatus.ACTIVE);
    }
    
    public static RateIlocActive createRateIlocActive(Long id, RateStatus status) {
        JsonNode data = TestDataLoader.getRateIlocActives().get(0);
        RateIlocActive active = new RateIlocActive();
        active.setId(id);
        active.setAmountTier(createAmountTier());
        active.setSubCategory(createSubCategory());
        active.setTargetRate(new BigDecimal(data.get("targetRate").asText()));
        active.setFloorRate(new BigDecimal(data.get("floorRate").asText()));
        active.setStartDate(LocalDate.parse(data.get("startDate").asText()));
        active.setExpiryDate(LocalDate.parse(data.get("expiryDate").asText()));
        active.setDetail(data.get("detail").asText());
        active.setNotes(data.get("notes").asText());
        active.setStatus(status);
        active.setChangeId(data.get("changeId").asText());
        active.setActive(ActiveStatus.valueOf(data.get("active").asText()));
        active.setCreatedOn(NOW);
        active.setCreatedBy(TEST_USER);
        return active;
    }
    
    public static RateIlocHistory createRateIlocHistory() {
        return createRateIlocHistory(1L, RateStatus.EXPIRED);
    }
    
    public static RateIlocHistory createRateIlocHistory(Long id, RateStatus status) {
        RateIlocHistory history = new RateIlocHistory();
        history.setId(id);
        history.setAmountTier(createAmountTier());
        history.setSubCategory(createSubCategory());
        history.setTargetRate(new BigDecimal("7.00"));
        history.setFloorRate(new BigDecimal("4.50"));
        history.setStartDate(LocalDate.of(2023, 1, 1));
        history.setExpiryDate(LocalDate.of(2023, 12, 31));
        history.setDetail("Historical ILOC rate");
        history.setNotes("Expired rate");
        history.setStatus(status);
        history.setChangeId("CHG-ILOC-HIST0001");
        history.setActive(ActiveStatus.Y);
        history.setCreatedOn(NOW);
        history.setCreatedBy(TEST_USER);
        return history;
    }
    
    public static RateIlocInput createRateIlocInput() {
        JsonNode data = TestDataLoader.getRateIlocDrafts().get(0);
        return RateIlocInput.builder()
                .amountTierId(data.get("amountTierId").asLong())
                .subCategoryId(data.get("subCategoryId").asLong())
                .targetRate(new BigDecimal(data.get("targetRate").asText()))
                .floorRate(new BigDecimal(data.get("floorRate").asText()))
                .startDate(LocalDate.parse(data.get("startDate").asText()))
                .expiryDate(LocalDate.parse(data.get("expiryDate").asText()))
                .detail(data.get("detail").asText())
                .notes(data.get("notes").asText())
                .build();
    }
    
    public static RateIlocAdminView createRateIlocAdminView() {
        return createRateIlocAdminView(1L, RateStatus.DRAFT, "DRAFT");
    }
    
    public static RateIlocAdminView createRateIlocAdminView(Long id, RateStatus status, String source) {
        JsonNode data = TestDataLoader.getRateIlocDrafts().get(0);
        return RateIlocAdminView.builder()
                .id(id)
                .amountTier(createAmountTierUserView())
                .subCategory(createSubCategoryUserView())
                .targetRate(new BigDecimal(data.get("targetRate").asText()))
                .floorRate(new BigDecimal(data.get("floorRate").asText()))
                .startDate(LocalDate.parse(data.get("startDate").asText()))
                .expiryDate(LocalDate.parse(data.get("expiryDate").asText()))
                .detail(data.get("detail").asText())
                .notes(data.get("notes").asText())
                .status(status)
                .changeId(data.get("changeId").asText())
                .source(source)
                .active(true)
                .createdOn(NOW)
                .createdBy(TEST_USER)
                .build();
    }
    
    // ============================================================
    // RATE ULOC
    // ============================================================
    
    public static RateUlocDraft createRateUlocDraft() {
        return createRateUlocDraft(1L, RateStatus.DRAFT);
    }
    
    public static RateUlocDraft createRateUlocDraft(Long id, RateStatus status) {
        JsonNode data = TestDataLoader.getRateUlocDrafts().get(0);
        RateUlocDraft draft = new RateUlocDraft();
        draft.setId(id);
        draft.setCvpCode(createCvpCode());
        draft.setAmountTier(createAmountTier());
        draft.setTargetRate(new BigDecimal(data.get("targetRate").asText()));
        draft.setFloorRate(new BigDecimal(data.get("floorRate").asText()));
        draft.setStartDate(LocalDate.parse(data.get("startDate").asText()));
        draft.setExpiryDate(LocalDate.parse(data.get("expiryDate").asText()));
        draft.setDetail(data.get("detail").asText());
        draft.setNotes(data.get("notes").asText());
        draft.setStatus(status);
        draft.setChangeId(data.get("changeId").asText());
        draft.setActive(ActiveStatus.valueOf(data.get("active").asText()));
        draft.setCreatedOn(NOW);
        draft.setCreatedBy(TEST_USER);
        return draft;
    }
    
    public static RateUlocActive createRateUlocActive() {
        return createRateUlocActive(1L, RateStatus.ACTIVE);
    }
    
    public static RateUlocActive createRateUlocActive(Long id, RateStatus status) {
        RateUlocActive active = new RateUlocActive();
        active.setId(id);
        active.setCvpCode(createCvpCode());
        active.setAmountTier(createAmountTier());
        active.setTargetRate(new BigDecimal("8.25"));
        active.setFloorRate(new BigDecimal("5.75"));
        active.setStartDate(LocalDate.of(2025, 1, 1));
        active.setExpiryDate(LocalDate.of(2025, 12, 31));
        active.setDetail("Active ULOC rate");
        active.setNotes("Current rate");
        active.setStatus(status);
        active.setChangeId("CHG-ULOC-00000002");
        active.setActive(ActiveStatus.Y);
        active.setCreatedOn(NOW);
        active.setCreatedBy(TEST_USER);
        return active;
    }
    
    public static RateUlocHistory createRateUlocHistory() {
        return createRateUlocHistory(1L, RateStatus.EXPIRED);
    }
    
    public static RateUlocHistory createRateUlocHistory(Long id, RateStatus status) {
        RateUlocHistory history = new RateUlocHistory();
        history.setId(id);
        history.setCvpCode(createCvpCode());
        history.setAmountTier(createAmountTier());
        history.setTargetRate(new BigDecimal("8.00"));
        history.setFloorRate(new BigDecimal("5.50"));
        history.setStartDate(LocalDate.of(2023, 1, 1));
        history.setExpiryDate(LocalDate.of(2023, 12, 31));
        history.setDetail("Historical ULOC rate");
        history.setNotes("Expired rate");
        history.setStatus(status);
        history.setChangeId("CHG-ULOC-HIST0001");
        history.setActive(ActiveStatus.Y);
        history.setCreatedOn(NOW);
        history.setCreatedBy(TEST_USER);
        return history;
    }
    
    public static RateUlocInput createRateUlocInput() {
        JsonNode data = TestDataLoader.getRateUlocDrafts().get(0);
        return RateUlocInput.builder()
                .cvpCodeId(data.get("cvpCodeId").asLong())
                .amountTierId(data.get("amountTierId").asLong())
                .targetRate(new BigDecimal(data.get("targetRate").asText()))
                .floorRate(new BigDecimal(data.get("floorRate").asText()))
                .startDate(LocalDate.parse(data.get("startDate").asText()))
                .expiryDate(LocalDate.parse(data.get("expiryDate").asText()))
                .detail(data.get("detail").asText())
                .notes(data.get("notes").asText())
                .build();
    }
    
    public static RateUlocAdminView createRateUlocAdminView() {
        return createRateUlocAdminView(1L, RateStatus.DRAFT, "DRAFT");
    }
    
    public static RateUlocAdminView createRateUlocAdminView(Long id, RateStatus status, String source) {
        JsonNode data = TestDataLoader.getRateUlocDrafts().get(0);
        return RateUlocAdminView.builder()
                .id(id)
                .cvpCode(createCvpCodeUserView())
                .amountTier(createAmountTierUserView())
                .targetRate(new BigDecimal(data.get("targetRate").asText()))
                .floorRate(new BigDecimal(data.get("floorRate").asText()))
                .startDate(LocalDate.parse(data.get("startDate").asText()))
                .expiryDate(LocalDate.parse(data.get("expiryDate").asText()))
                .detail(data.get("detail").asText())
                .notes(data.get("notes").asText())
                .status(status)
                .changeId(data.get("changeId").asText())
                .source(source)
                .active(true)
                .createdOn(NOW)
                .createdBy(TEST_USER)
                .build();
    }
    
    // ============================================================
    // WORKFLOW
    // ============================================================
    
    public static Workflow createWorkflow() {
        return createWorkflow(1L);
    }
    
    public static Workflow createWorkflow(Long id) {
        JsonNode data = TestDataLoader.getWorkflows().get(0);
        Workflow workflow = new Workflow();
        workflow.setId(id);
        workflow.setRateType(RateType.valueOf(data.get("rateType").asText()));
        workflow.setRateId(data.get("rateId").asLong());
        workflow.setAction(WorkflowAction.valueOf(data.get("action").asText()));
        workflow.setFromStatus(null);
        workflow.setToStatus(RateStatus.valueOf(data.get("toStatus").asText()));
        workflow.setPerformedBy(data.get("performedBy").asText());
        workflow.setNotes(data.get("notes").asText());
        workflow.setCreatedOn(NOW);
        workflow.setCreatedBy(TEST_USER);
        return workflow;
    }
    
    public static WorkflowAdminView createWorkflowAdminView() {
        return createWorkflowAdminView(1L);
    }
    
    public static WorkflowAdminView createWorkflowAdminView(Long id) {
        JsonNode data = TestDataLoader.getWorkflows().get(0);
        return WorkflowAdminView.builder()
                .id(id)
                .rateType(RateType.valueOf(data.get("rateType").asText()))
                .rateId(data.get("rateId").asLong())
                .action(WorkflowAction.valueOf(data.get("action").asText()))
                .fromStatus(null)
                .toStatus(RateStatus.valueOf(data.get("toStatus").asText()))
                .performedBy(data.get("performedBy").asText())
                .notes(data.get("notes").asText())
                .createdOn(NOW)
                .createdBy(TEST_USER)
                .build();
    }
    
    // ============================================================
    // NOTIFICATION
    // ============================================================
    
    public static Notification createNotification() {
        return createNotification(1L);
    }
    
    public static Notification createNotification(Long id) {
        JsonNode data = TestDataLoader.getNotifications().get(0);
        Notification notification = new Notification();
        notification.setId(id);
        notification.setTitle(data.get("title").asText());
        notification.setMessage(data.get("message").asText());
        notification.setStatus(NotificationStatus.valueOf(data.get("status").asText()));
        notification.setActive(ActiveStatus.valueOf(data.get("active").asText()));
        notification.setCreatedOn(NOW);
        notification.setCreatedBy(TEST_USER);
        return notification;
    }
    
    public static NotificationInput createNotificationInput() {
        JsonNode data = TestDataLoader.getNotifications().get(0);
        return NotificationInput.builder()
                .title(data.get("title").asText())
                .message(data.get("message").asText())
                .build();
    }
    
    public static NotificationAdminView createNotificationAdminView() {
        return createNotificationAdminView(1L);
    }
    
    public static NotificationAdminView createNotificationAdminView(Long id) {
        JsonNode data = TestDataLoader.getNotifications().get(0);
        return NotificationAdminView.builder()
                .id(id)
                .title(data.get("title").asText())
                .message(data.get("message").asText())
                .status(NotificationStatus.valueOf(data.get("status").asText()))
                .active(true)
                .createdOn(NOW)
                .createdBy(TEST_USER)
                .build();
    }
}
