package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.Workflow;
import com.td.plra.persistence.enums.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
@DisplayName("WorkflowRepository Integration Tests")
class WorkflowRepositoryTest {
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Autowired
    private WorkflowRepository repository;
    
    private Workflow workflow;
    
    @BeforeEach
    void setUp() {
        workflow = new Workflow();
        workflow.setRateType(RateType.ILOC);
        workflow.setRateStatus(RateStatus.DRAFT);
        workflow.setRateId(1L);
        workflow.setChangeId("CHG-TEST-001");
        workflow.setAction(WorkflowAction.CREATE);
        workflow.setChangeBy("test-user");
        workflow.setChangeOn(LocalDateTime.now());
        workflow.setFromStatus(null);
        workflow.setToStatus(RateStatus.DRAFT);
        workflow.setActive(ActiveStatus.Y);
        workflow.setCreatedBy("test-user");
        workflow.setUpdatedBy("test-user");
    }
    
    @Nested
    @DisplayName("Save Operations")
    class SaveOperations {
        
        @Test
        @DisplayName("Should save workflow with generated ID")
        void shouldSaveWorkflowWithGeneratedId() {
            // When
            Workflow saved = repository.save(workflow);
            
            // Then
            assertThat(saved.getId()).isNotNull();
            assertThat(saved.getChangeId()).isEqualTo("CHG-TEST-001");
            assertThat(saved.getAction()).isEqualTo(WorkflowAction.CREATE);
        }
    }
    
    @Nested
    @DisplayName("Find Operations")
    class FindOperations {
        
        @Test
        @DisplayName("Should find workflow by ID")
        void shouldFindWorkflowById() {
            // Given
            Workflow saved = entityManager.persistAndFlush(workflow);
            
            // When
            Optional<Workflow> found = repository.findById(saved.getId());
            
            // Then
            assertThat(found).isPresent();
            assertThat(found.get().getRateType()).isEqualTo(RateType.ILOC);
        }
        
        @Test
        @DisplayName("Should find all workflows with pagination")
        void shouldFindAllWorkflowsWithPagination() {
            // Given
            entityManager.persistAndFlush(workflow);
            
            Workflow workflow2 = new Workflow();
            workflow2.setRateType(RateType.ULOC);
            workflow2.setRateStatus(RateStatus.PENDING_APPROVAL);
            workflow2.setRateId(2L);
            workflow2.setChangeId("CHG-TEST-002");
            workflow2.setAction(WorkflowAction.SUBMIT);
            workflow2.setChangeBy("test-user");
            workflow2.setChangeOn(LocalDateTime.now());
            workflow2.setFromStatus(RateStatus.DRAFT);
            workflow2.setToStatus(RateStatus.PENDING_APPROVAL);
            workflow2.setActive(ActiveStatus.Y);
            workflow2.setCreatedBy("test-user");
            workflow2.setUpdatedBy("test-user");
            entityManager.persistAndFlush(workflow2);
            
            // When
            Page<Workflow> page = repository.findAll(PageRequest.of(0, 10));
            
            // Then
            assertThat(page.getContent()).hasSize(2);
        }
    }
    
    @Nested
    @DisplayName("Custom Query Methods")
    class CustomQueryMethods {
        
        @Test
        @DisplayName("Should find by rate type and rate ID")
        void shouldFindByRateTypeAndRateId() {
            // Given
            entityManager.persistAndFlush(workflow);
            
            // Create another workflow for same rate
            Workflow workflow2 = new Workflow();
            workflow2.setRateType(RateType.ILOC);
            workflow2.setRateStatus(RateStatus.PENDING_APPROVAL);
            workflow2.setRateId(1L);
            workflow2.setChangeId("CHG-TEST-001");
            workflow2.setAction(WorkflowAction.SUBMIT);
            workflow2.setChangeBy("test-user");
            workflow2.setChangeOn(LocalDateTime.now().plusMinutes(5));
            workflow2.setFromStatus(RateStatus.DRAFT);
            workflow2.setToStatus(RateStatus.PENDING_APPROVAL);
            workflow2.setActive(ActiveStatus.Y);
            workflow2.setCreatedBy("test-user");
            workflow2.setUpdatedBy("test-user");
            entityManager.persistAndFlush(workflow2);
            
            // When
            List<Workflow> workflows = repository.findByRateTypeAndRateIdOrderByChangeOnDesc(RateType.ILOC, 1L);
            
            // Then
            assertThat(workflows).hasSize(2);
            // Should be ordered by changeOn DESC
            assertThat(workflows.get(0).getAction()).isEqualTo(WorkflowAction.SUBMIT);
            assertThat(workflows.get(1).getAction()).isEqualTo(WorkflowAction.CREATE);
        }
        
        @Test
        @DisplayName("Should find by change ID")
        void shouldFindByChangeId() {
            // Given
            entityManager.persistAndFlush(workflow);
            
            // When
            List<Workflow> workflows = repository.findByChangeIdOrderByChangeOnDesc("CHG-TEST-001");
            
            // Then
            assertThat(workflows).hasSize(1);
            assertThat(workflows.get(0).getChangeId()).isEqualTo("CHG-TEST-001");
        }
        
        @Test
        @DisplayName("Should return empty list for non-existent change ID")
        void shouldReturnEmptyListForNonExistentChangeId() {
            // Given
            entityManager.persistAndFlush(workflow);
            
            // When
            List<Workflow> workflows = repository.findByChangeIdOrderByChangeOnDesc("NON-EXISTENT");
            
            // Then
            assertThat(workflows).isEmpty();
        }
    }
    
    @Nested
    @DisplayName("Rate Type Filtering")
    class RateTypeFiltering {
        
        @Test
        @DisplayName("Should filter by rate type")
        void shouldFilterByRateType() {
            // Given
            entityManager.persistAndFlush(workflow);
            
            Workflow ulocWorkflow = new Workflow();
            ulocWorkflow.setRateType(RateType.ULOC);
            ulocWorkflow.setRateStatus(RateStatus.DRAFT);
            ulocWorkflow.setRateId(1L);
            ulocWorkflow.setChangeId("CHG-ULOC-001");
            ulocWorkflow.setAction(WorkflowAction.CREATE);
            ulocWorkflow.setChangeBy("test-user");
            ulocWorkflow.setChangeOn(LocalDateTime.now());
            ulocWorkflow.setActive(ActiveStatus.Y);
            ulocWorkflow.setCreatedBy("test-user");
            ulocWorkflow.setUpdatedBy("test-user");
            entityManager.persistAndFlush(ulocWorkflow);
            
            // When
            List<Workflow> ilocWorkflows = repository.findByRateTypeAndRateIdOrderByChangeOnDesc(RateType.ILOC, 1L);
            List<Workflow> ulocWorkflows = repository.findByRateTypeAndRateIdOrderByChangeOnDesc(RateType.ULOC, 1L);
            
            // Then
            assertThat(ilocWorkflows).hasSize(1);
            assertThat(ilocWorkflows.get(0).getRateType()).isEqualTo(RateType.ILOC);
            
            assertThat(ulocWorkflows).hasSize(1);
            assertThat(ulocWorkflows.get(0).getRateType()).isEqualTo(RateType.ULOC);
        }
    }
}
