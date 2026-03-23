package com.td.plra.testutil;

import com.fasterxml.jackson.databind.JsonNode;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.RateStatus;
import com.td.plra.persistence.enums.RateType;
import com.td.plra.persistence.enums.WorkflowAction;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Verifies JSON mock data integrity and alignment with DB2 schema v2.0.
 * Tests that the mock-data.json file is valid, loads correctly, and
 * contains values consistent with the application's enum definitions.
 */
class MockDataVerificationTest {

    @Test @DisplayName("Mock data JSON should load successfully")
    void mockDataLoads() {
        assertThat(TestDataFactory.isMockDataLoaded()).isTrue();
    }

    @Nested @DisplayName("Product Data Verification")
    class ProductTests {
        @Test @DisplayName("Should contain expected product count")
        void productCount() {
            assertThat(TestDataFactory.getMockCount("products")).isEqualTo(3);
        }

        @Test @DisplayName("Products should have required fields")
        void productFields() {
            JsonNode products = TestDataFactory.getMockArray("products");
            for (JsonNode p : products) {
                assertThat(p.has("id")).isTrue();
                assertThat(p.has("name")).isTrue();
                assertThat(p.has("type")).isTrue();
                assertThat(p.has("active")).isTrue();
                String active = p.get("active").asText();
                assertThat(active).isIn("Y", "N");
            }
        }

        @Test @DisplayName("Product active values should match ActiveStatus enum")
        void productActiveEnum() {
            JsonNode products = TestDataFactory.getMockArray("products");
            for (JsonNode p : products) {
                String active = p.get("active").asText();
                ActiveStatus status = ActiveStatus.valueOf(active);
                assertThat(status).isNotNull();
            }
        }
    }

    @Nested @DisplayName("Rate ILOC Data Verification")
    class RateIlocTests {
        @Test @DisplayName("Draft count matches expected")
        void draftCount() {
            assertThat(TestDataFactory.getMockCount("rateIlocDrafts")).isEqualTo(2);
        }

        @Test @DisplayName("Active count matches expected")
        void activeCount() {
            assertThat(TestDataFactory.getMockCount("rateIlocActive")).isEqualTo(1);
        }

        @Test @DisplayName("Draft status values should match RateStatus enum")
        void draftStatusEnum() {
            JsonNode drafts = TestDataFactory.getMockArray("rateIlocDrafts");
            for (JsonNode d : drafts) {
                String status = d.get("status").asText();
                RateStatus rs = RateStatus.valueOf(status);
                assertThat(rs).isNotNull();
            }
        }

        @Test @DisplayName("Rate fields should have required columns")
        void rateFields() {
            JsonNode drafts = TestDataFactory.getMockArray("rateIlocDrafts");
            for (JsonNode d : drafts) {
                assertThat(d.has("id")).isTrue();
                assertThat(d.has("amountTierId")).isTrue();
                assertThat(d.has("subCategoryId")).isTrue();
                assertThat(d.has("targetRate")).isTrue();
                assertThat(d.has("floorRate")).isTrue();
                assertThat(d.has("discretion")).isTrue();
                assertThat(d.has("startDate")).isTrue();
                assertThat(d.has("expiryDate")).isTrue();
                assertThat(d.has("changeId")).isTrue();
            }
        }

        @Test @DisplayName("ILOC drafts use subCategoryId (not cvpCodeId)")
        void ilocUsesSubCategoryId() {
            JsonNode drafts = TestDataFactory.getMockArray("rateIlocDrafts");
            for (JsonNode d : drafts) {
                assertThat(d.has("subCategoryId")).isTrue();
                assertThat(d.has("cvpCodeId")).isFalse();
            }
        }
    }

    @Nested @DisplayName("Rate ULOC Data Verification")
    class RateUlocTests {
        @Test @DisplayName("ULOC drafts use cvpCodeId (not subCategoryId)")
        void ulocUsesCvpCodeId() {
            JsonNode drafts = TestDataFactory.getMockArray("rateUlocDrafts");
            assertThat(drafts).isNotNull();
            for (JsonNode d : drafts) {
                assertThat(d.has("cvpCodeId")).isTrue();
                assertThat(d.has("subCategoryId")).isFalse();
            }
        }
    }

    @Nested @DisplayName("Workflow Data Verification")
    class WorkflowTests {
        @Test @DisplayName("Workflow count matches expected")
        void workflowCount() {
            assertThat(TestDataFactory.getMockCount("workflows")).isEqualTo(3);
        }

        @Test @DisplayName("Workflow rateType values match RateType enum")
        void workflowRateTypeEnum() {
            JsonNode workflows = TestDataFactory.getMockArray("workflows");
            for (JsonNode w : workflows) {
                String rt = w.get("rateType").asText();
                RateType rateType = RateType.valueOf(rt);
                assertThat(rateType).isNotNull();
            }
        }

        @Test @DisplayName("Workflow action values match WorkflowAction enum")
        void workflowActionEnum() {
            JsonNode workflows = TestDataFactory.getMockArray("workflows");
            for (JsonNode w : workflows) {
                String action = w.get("action").asText();
                WorkflowAction wa = WorkflowAction.valueOf(action);
                assertThat(wa).isNotNull();
            }
        }

        @Test @DisplayName("Workflow changeId should be populated (v2.0 requirement)")
        void workflowChangeIdPresent() {
            JsonNode workflows = TestDataFactory.getMockArray("workflows");
            for (JsonNode w : workflows) {
                assertThat(w.has("changeId")).isTrue();
                assertThat(w.get("changeId").asLong()).isGreaterThan(0);
            }
        }

        @Test @DisplayName("Rejection workflow should have message")
        void rejectionHasMessage() {
            JsonNode workflows = TestDataFactory.getMockArray("workflows");
            boolean foundReject = false;
            for (JsonNode w : workflows) {
                if ("REJECT".equals(w.get("action").asText())) {
                    assertThat(w.get("message").asText()).isNotEmpty();
                    foundReject = true;
                }
            }
            assertThat(foundReject).isTrue();
        }
    }

    @Nested @DisplayName("Enum Completeness")
    class EnumTests {
        @Test @DisplayName("RateStatus should have all 8 values")
        void rateStatusValues() {
            assertThat(RateStatus.values()).hasSize(8);
            assertThat(RateStatus.valueOf("DRAFT")).isNotNull();
            assertThat(RateStatus.valueOf("PENDING")).isNotNull();
            assertThat(RateStatus.valueOf("APPROVED")).isNotNull();
            assertThat(RateStatus.valueOf("REJECTED")).isNotNull();
            assertThat(RateStatus.valueOf("ACTIVE")).isNotNull();
            assertThat(RateStatus.valueOf("EXPIRED")).isNotNull();
            assertThat(RateStatus.valueOf("SUPERSEDED")).isNotNull();
            assertThat(RateStatus.valueOf("CANCELLED")).isNotNull();
        }

        @Test @DisplayName("WorkflowAction should have all 8 values")
        void workflowActionValues() {
            assertThat(WorkflowAction.values()).hasSize(8);
            assertThat(WorkflowAction.valueOf("CREATE")).isNotNull();
            assertThat(WorkflowAction.valueOf("UPDATE")).isNotNull();
            assertThat(WorkflowAction.valueOf("SUBMIT")).isNotNull();
            assertThat(WorkflowAction.valueOf("APPROVE")).isNotNull();
            assertThat(WorkflowAction.valueOf("REJECT")).isNotNull();
            assertThat(WorkflowAction.valueOf("CANCEL")).isNotNull();
            assertThat(WorkflowAction.valueOf("EXPIRE")).isNotNull();
            assertThat(WorkflowAction.valueOf("ARCHIVE")).isNotNull();
        }

        @Test @DisplayName("RateType should have ILOC and ULOC")
        void rateTypeValues() {
            assertThat(RateType.values()).hasSize(2);
            assertThat(RateType.valueOf("ILOC")).isNotNull();
            assertThat(RateType.valueOf("ULOC")).isNotNull();
        }

        @Test @DisplayName("ActiveStatus should have Y and N")
        void activeStatusValues() {
            assertThat(ActiveStatus.values()).hasSize(2);
            assertThat(ActiveStatus.valueOf("Y")).isNotNull();
            assertThat(ActiveStatus.valueOf("N")).isNotNull();
        }
    }
}
