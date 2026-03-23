package com.td.plra.testutil;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
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

import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public final class TestDataFactory {

    private static final ObjectMapper MAPPER = new ObjectMapper().registerModule(new JavaTimeModule());
    private static JsonNode mockData;

    static {
        try (InputStream is = TestDataFactory.class.getResourceAsStream("/testdata/mock-data.json")) {
            if (is != null) mockData = MAPPER.readTree(is);
        } catch (Exception e) {
            throw new RuntimeException("Failed to load mock-data.json", e);
        }
    }

    private TestDataFactory() {}

    public static JsonNode getMockData() { return mockData; }
    public static JsonNode getMockArray(String key) { return mockData != null ? mockData.get(key) : null; }
    public static boolean isMockDataLoaded() {
        return mockData != null && mockData.has("products") && mockData.has("rateIlocDrafts");
    }
    public static int getMockCount(String arrayName) {
        JsonNode arr = getMockArray(arrayName);
        return arr != null ? arr.size() : 0;
    }

    // ================================================================
    // PRODUCT
    // ================================================================
    public static Product product() { return product(1L, "Personal Lending"); }
    public static Product product(Long id, String name) {
        Product p = new Product(); p.setId(id); p.setName(name); p.setType("RETAIL");
        p.setSecurityCode("SEC001"); p.setDetail("Test product"); p.setActive(ActiveStatus.Y);
        p.setCreatedBy("system"); p.setCreatedOn(LocalDateTime.now()); p.setVersion(1); return p;
    }
    public static ProductInput productInput() { return productInput("Personal Lending"); }
    public static ProductInput productInput(String name) {
        ProductInput i = new ProductInput(); i.setName(name); i.setType("RETAIL");
        i.setSecurityCode("SEC001"); i.setDetail("Test product"); return i;
    }
    public static ProductAdminView productAdminView() { return productAdminView(1L, "Personal Lending"); }
    public static ProductAdminView productAdminView(Long id, String name) {
        return ProductAdminView.builder().id(id).name(name).type("RETAIL").securityCode("SEC001")
                .detail("Test product").active(true).createdBy("system").createdOn(LocalDateTime.now()).version(1).build();
    }
    public static ProductUserView productUserView() {
        return ProductUserView.builder().id(1L).name("Personal Lending").type("RETAIL")
                .securityCode("SEC001").detail("Test product").build();
    }

    // ================================================================
    // CATEGORY
    // ================================================================
    public static Category category() { return category(10L, "Secured Loans", product()); }
    public static Category category(Long id, String name, Product product) {
        Category c = new Category(); c.setId(id); c.setName(name); c.setDetail("Test category");
        c.setActive(ActiveStatus.Y); c.setProduct(product); c.setCreatedBy("system");
        c.setCreatedOn(LocalDateTime.now()); c.setVersion(1); return c;
    }
    public static CategoryInput categoryInput() {
        CategoryInput i = new CategoryInput(); i.setName("Secured Loans"); i.setDetail("Test category"); return i;
    }
    public static CategoryAdminView categoryAdminView() {
        return CategoryAdminView.builder().id(10L).name("Secured Loans").detail("Test category")
                .active(true).product(productUserView()).createdBy("system").createdOn(LocalDateTime.now()).version(1).build();
    }
    public static CategoryUserView categoryUserView() {
        return CategoryUserView.builder().id(10L).name("Secured Loans").detail("Test category").build();
    }

    // ================================================================
    // SUB_CATEGORY
    // ================================================================
    public static SubCategory subCategory() { return subCategory(100L, "Investment LOC", category()); }
    public static SubCategory subCategory(Long id, String name, Category cat) {
        SubCategory sc = new SubCategory(); sc.setId(id); sc.setName(name); sc.setDetail("Test subcategory");
        sc.setActive(ActiveStatus.Y); sc.setCategory(cat); sc.setCreatedBy("system");
        sc.setCreatedOn(LocalDateTime.now()); sc.setVersion(1); return sc;
    }
    public static SubCategoryInput subCategoryInput() {
        SubCategoryInput i = new SubCategoryInput(); i.setName("Investment LOC"); i.setDetail("Test subcategory"); return i;
    }
    public static SubCategoryAdminView subCategoryAdminView() {
        return SubCategoryAdminView.builder().id(100L).name("Investment LOC").detail("Test subcategory")
                .active(true).createdBy("system").createdOn(LocalDateTime.now()).version(1).build();
    }
    public static SubCategoryUserView subCategoryUserView() {
        return SubCategoryUserView.builder().id(100L).name("Investment LOC").detail("Test subcategory").build();
    }

    // ================================================================
    // CVP_CODE
    // ================================================================
    public static CvpCode cvpCode() { return cvpCode(200L, "CVP-ULOC-STD", subCategory()); }
    public static CvpCode cvpCode(Long id, String name, SubCategory sc) {
        CvpCode cv = new CvpCode(); cv.setId(id); cv.setName(name); cv.setDetail("Test CVP code");
        cv.setActive(ActiveStatus.Y); cv.setSubCategory(sc); cv.setCreatedBy("system");
        cv.setCreatedOn(LocalDateTime.now()); cv.setVersion(1); return cv;
    }
    public static CvpCodeInput cvpCodeInput() {
        CvpCodeInput i = new CvpCodeInput(); i.setName("CVP-ULOC-STD"); i.setDetail("Test CVP code");
        i.setSubCategoryId(100L); return i;
    }
    public static CvpCodeUserView cvpCodeUserView() {
        return CvpCodeUserView.builder().id(200L).name("CVP-ULOC-STD").detail("Test CVP code").build();
    }

    // ================================================================
    // AMOUNT_TIER
    // ================================================================
    public static AmountTier amountTier() { return amountTier(300L, "Tier 1", product()); }
    public static AmountTier amountTier(Long id, String name, Product product) {
        AmountTier at = new AmountTier(); at.setId(id); at.setName(name); at.setDetail("Test tier");
        at.setActive(ActiveStatus.Y); at.setMin(BigDecimal.ZERO); at.setMax(new BigDecimal("50000.00"));
        at.setProduct(product); at.setCreatedBy("system"); at.setCreatedOn(LocalDateTime.now()); at.setVersion(1); return at;
    }
    public static AmountTierInput amountTierInput() {
        AmountTierInput i = new AmountTierInput(); i.setName("Tier 1"); i.setDetail("Test tier");
        i.setMin(BigDecimal.ZERO); i.setMax(new BigDecimal("50000.00")); return i;
    }
    public static AmountTierUserView amountTierUserView() {
        return AmountTierUserView.builder().id(300L).name("Tier 1").detail("Test tier")
                .min(BigDecimal.ZERO).max(new BigDecimal("50000.00")).build();
    }

    // ================================================================
    // RATE ILOC
    // ================================================================
    public static RateIlocDraft rateIlocDraft() { return rateIlocDraft(1000L, RateStatus.DRAFT); }
    public static RateIlocDraft rateIlocDraft(Long id, RateStatus status) {
        RateIlocDraft d = new RateIlocDraft(); d.setId(id); d.setAmountTier(amountTier());
        d.setSubCategory(subCategory()); d.setDetail("Test ILOC draft");
        d.setTargetRate(new BigDecimal("5.250000")); d.setFloorRate(new BigDecimal("3.750000"));
        d.setDiscretion(new BigDecimal("1.500000")); d.setStartDate(LocalDate.of(2025, 7, 1));
        d.setExpiryDate(LocalDate.of(2025, 12, 31)); d.setStatus(status); d.setActive(ActiveStatus.Y);
        d.setChangeId(1001L); d.setCreatedBy("system"); d.setCreatedOn(LocalDateTime.now()); d.setVersion(1); return d;
    }
    public static RateIlocActive rateIlocActive() { return rateIlocActive(900L); }
    public static RateIlocActive rateIlocActive(Long id) {
        RateIlocActive a = new RateIlocActive(); a.setId(id); a.setAmountTier(amountTier());
        a.setSubCategory(subCategory()); a.setDetail("Test ILOC active");
        a.setTargetRate(new BigDecimal("5.000000")); a.setFloorRate(new BigDecimal("3.500000"));
        a.setDiscretion(new BigDecimal("1.250000")); a.setStartDate(LocalDate.of(2025, 1, 1));
        a.setExpiryDate(LocalDate.of(2025, 6, 30)); a.setStatus(RateStatus.ACTIVE); a.setActive(ActiveStatus.Y);
        a.setChangeId(999L); a.setCreatedBy("system"); a.setCreatedOn(LocalDateTime.now()); a.setVersion(1); return a;
    }
    public static RateIlocHistory rateIlocHistory() {
        RateIlocHistory h = new RateIlocHistory(); h.setId(800L); h.setAmountTier(amountTier());
        h.setSubCategory(subCategory()); h.setDetail("Test ILOC history");
        h.setTargetRate(new BigDecimal("4.500000")); h.setFloorRate(new BigDecimal("3.000000"));
        h.setDiscretion(new BigDecimal("1.000000")); h.setStartDate(LocalDate.of(2024, 7, 1));
        h.setExpiryDate(LocalDate.of(2024, 12, 31)); h.setStatus(RateStatus.EXPIRED); h.setActive(ActiveStatus.N);
        h.setChangeId(800L); h.setCreatedBy("system"); h.setCreatedOn(LocalDateTime.now()); h.setVersion(1); return h;
    }
    public static RateIlocInput rateIlocInput() {
        return RateIlocInput.builder().amountTierId(300L).subCategoryId(100L).detail("Test ILOC rate")
                .targetRate(new BigDecimal("5.250000")).floorRate(new BigDecimal("3.750000"))
                .discretion(new BigDecimal("1.500000")).startDate(LocalDate.of(2025, 7, 1))
                .expiryDate(LocalDate.of(2025, 12, 31)).notes("Test notes").build();
    }
    public static RateIlocAdminView rateIlocAdminView() { return rateIlocAdminView(1000L, RateStatus.DRAFT, "DRAFT"); }
    public static RateIlocAdminView rateIlocAdminView(Long id, RateStatus status, String source) {
        return RateIlocAdminView.builder().id(id).amountTier(amountTierUserView()).subCategory(subCategoryUserView())
                .detail("Test ILOC rate").targetRate(new BigDecimal("5.250000")).floorRate(new BigDecimal("3.750000"))
                .discretion(new BigDecimal("1.500000")).startDate(LocalDate.of(2025, 7, 1))
                .expiryDate(LocalDate.of(2025, 12, 31)).status(status).active(true).changeId(1001L).source(source)
                .createdBy("system").createdOn(LocalDateTime.now()).version(1).build();
    }

    // ================================================================
    // RATE ULOC
    // ================================================================
    public static RateUlocDraft rateUlocDraft() { return rateUlocDraft(2000L, RateStatus.DRAFT); }
    public static RateUlocDraft rateUlocDraft(Long id, RateStatus status) {
        RateUlocDraft d = new RateUlocDraft(); d.setId(id); d.setCvpCode(cvpCode()); d.setAmountTier(amountTier());
        d.setDetail("Test ULOC draft"); d.setTargetRate(new BigDecimal("7.500000"));
        d.setFloorRate(new BigDecimal("5.250000")); d.setDiscretion(new BigDecimal("2.000000"));
        d.setStartDate(LocalDate.of(2025, 7, 1)); d.setExpiryDate(LocalDate.of(2025, 12, 31));
        d.setStatus(status); d.setActive(ActiveStatus.Y); d.setChangeId(2001L);
        d.setCreatedBy("system"); d.setCreatedOn(LocalDateTime.now()); d.setVersion(1); return d;
    }
    public static RateUlocActive rateUlocActive() { return rateUlocActive(1900L); }
    public static RateUlocActive rateUlocActive(Long id) {
        RateUlocActive a = new RateUlocActive(); a.setId(id); a.setCvpCode(cvpCode()); a.setAmountTier(amountTier());
        a.setDetail("Test ULOC active"); a.setTargetRate(new BigDecimal("7.000000"));
        a.setFloorRate(new BigDecimal("5.000000")); a.setDiscretion(new BigDecimal("1.500000"));
        a.setStartDate(LocalDate.of(2025, 1, 1)); a.setExpiryDate(LocalDate.of(2025, 6, 30));
        a.setStatus(RateStatus.ACTIVE); a.setActive(ActiveStatus.Y); a.setChangeId(1999L);
        a.setCreatedBy("system"); a.setCreatedOn(LocalDateTime.now()); a.setVersion(1); return a;
    }
    public static RateUlocInput rateUlocInput() {
        return RateUlocInput.builder().cvpCodeId(200L).amountTierId(300L).detail("Test ULOC rate")
                .targetRate(new BigDecimal("7.500000")).floorRate(new BigDecimal("5.250000"))
                .discretion(new BigDecimal("2.000000")).startDate(LocalDate.of(2025, 7, 1))
                .expiryDate(LocalDate.of(2025, 12, 31)).notes("Test notes").build();
    }
    public static RateUlocAdminView rateUlocAdminView() { return rateUlocAdminView(2000L, RateStatus.DRAFT, "DRAFT"); }
    public static RateUlocAdminView rateUlocAdminView(Long id, RateStatus status, String source) {
        return RateUlocAdminView.builder().id(id).cvpCode(cvpCodeUserView()).amountTier(amountTierUserView())
                .detail("Test ULOC rate").targetRate(new BigDecimal("7.500000")).floorRate(new BigDecimal("5.250000"))
                .discretion(new BigDecimal("2.000000")).startDate(LocalDate.of(2025, 7, 1))
                .expiryDate(LocalDate.of(2025, 12, 31)).status(status).active(true).changeId(2001L).source(source)
                .createdBy("system").createdOn(LocalDateTime.now()).version(1).build();
    }

    // ================================================================
    // WORKFLOW
    // ================================================================
    public static Workflow workflow() {
        Workflow w = new Workflow(); w.setId(5000L); w.setRateType(RateType.ILOC); w.setRateStatus(RateStatus.DRAFT);
        w.setRateId(1000L); w.setChangeId(1001L); w.setAction(WorkflowAction.CREATE); w.setChangeBy("system");
        w.setChangeOn(LocalDateTime.now()); w.setToStatus(RateStatus.DRAFT); w.setCreatedBy("system");
        w.setCreatedOn(LocalDateTime.now()); w.setVersion(1); return w;
    }
    public static WorkflowAdminView workflowAdminView() {
        return WorkflowAdminView.builder().id(5000L).rateType(RateType.ILOC).rateStatus(RateStatus.DRAFT)
                .rateId(1000L).changeId(1001L).action(WorkflowAction.CREATE).changeBy("system")
                .changeOn(LocalDateTime.now()).toStatus(RateStatus.DRAFT).createdBy("system")
                .createdOn(LocalDateTime.now()).version(1).build();
    }
}
