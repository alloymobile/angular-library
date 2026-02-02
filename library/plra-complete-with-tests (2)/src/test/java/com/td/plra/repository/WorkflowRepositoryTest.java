package com.td.plra.repository;

import com.td.plra.common.BaseRepositoryTest;
import com.td.plra.persistence.entity.Workflow;
import com.td.plra.persistence.enums.RateStatus;
import com.td.plra.persistence.enums.RateType;
import com.td.plra.persistence.enums.WorkflowAction;
import com.td.plra.persistence.repository.WorkflowRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("WorkflowRepository Tests")
class WorkflowRepositoryTest extends BaseRepositoryTest {
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Autowired
    private WorkflowRepository repository;
    
    private Workflow workflow;
    
    @BeforeEach
    void setUp() {
        workflow = new Workflow();
        workflow.setRateType(RateType.ILOC);
        workflow.setRateId(1L);
        workflow.setAction(WorkflowAction.CREATE);
        workflow.setFromStatus(null);
        workflow.setToStatus(RateStatus.DRAFT);
        workflow.setPerformedBy("admin");
        workflow.setNotes("Draft created");
    }
    
    @Nested
    @DisplayName("findByRateType")
    class FindByRateType {
        
        @Test
        @DisplayName("Should find workflow by rate type")
        void shouldFindWorkflowByRateType() {
            // Given
            entityManager.persistAndFlush(workflow);
            
            // When
            Optional<Workflow> result = repository.findByRateType(RateType.ILOC);
            
            // Then
            assertThat(result).isPresent();
        }
    }
    
    @Nested
    @DisplayName("findByRateStatus")
    class FindByRateStatus {
        
        @Test
        @DisplayName("Should find workflows by rate status")
        void shouldFindWorkflowsByRateStatus() {
            // Given
            entityManager.persistAndFlush(workflow);
            
            // When
            List<Workflow> result = repository.findByRateStatus(RateStatus.DRAFT);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("findByAction")
    class FindByAction {
        
        @Test
        @DisplayName("Should find workflows by action")
        void shouldFindWorkflowsByAction() {
            // Given
            entityManager.persistAndFlush(workflow);
            
            // When
            List<Workflow> result = repository.findByAction(WorkflowAction.CREATE);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("findByRateTypeAndRateStatus")
    class FindByRateTypeAndRateStatus {
        
        @Test
        @DisplayName("Should find workflows by rate type and status")
        void shouldFindWorkflowsByRateTypeAndStatus() {
            // Given
            entityManager.persistAndFlush(workflow);
            
            // When
            List<Workflow> result = repository.findByRateTypeAndRateStatus(RateType.ILOC, RateStatus.DRAFT);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("findByRateId")
    class FindByRateId {
        
        @Test
        @DisplayName("Should find workflows by rate ID")
        void shouldFindWorkflowsByRateId() {
            // Given
            entityManager.persistAndFlush(workflow);
            
            // When
            List<Workflow> result = repository.findByRateId(1L);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("findByRateTypeAndRateId")
    class FindByRateTypeAndRateId {
        
        @Test
        @DisplayName("Should find workflows by rate type and rate ID")
        void shouldFindWorkflowsByRateTypeAndRateId() {
            // Given
            entityManager.persistAndFlush(workflow);
            
            // When
            List<Workflow> result = repository.findByRateTypeAndRateId(RateType.ILOC, 1L);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
}
