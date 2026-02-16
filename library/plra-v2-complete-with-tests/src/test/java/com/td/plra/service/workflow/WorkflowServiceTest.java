package com.td.plra.service.workflow;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.persistence.entity.Workflow;
import com.td.plra.persistence.enums.RateStatus;
import com.td.plra.persistence.enums.RateType;
import com.td.plra.persistence.enums.WorkflowAction;
import com.td.plra.persistence.repository.WorkflowRepository;
import com.td.plra.service.workflow.binding.WorkflowBinding;
import com.td.plra.service.workflow.dto.WorkflowAdminView;
import com.td.plra.service.workflow.mapper.WorkflowMapper;
import com.td.plra.testutil.TestDataFactory;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WorkflowServiceTest {

    @Mock private WorkflowRepository repository;
    @Mock private WorkflowMapper mapper;
    @Mock private WorkflowBinding binding;
    @InjectMocks private WorkflowService service;

    // ================================================================
    // RECORD TRANSITION
    // ================================================================
    @Nested @DisplayName("Record Transition")
    class RecordTransitionTests {
        @Test @DisplayName("Should record transition without message (6-arg overload)")
        void recordWithoutMessage() {
            when(repository.save(any(Workflow.class))).thenAnswer(inv -> {
                Workflow w = inv.getArgument(0);
                w.setId(5000L);
                return w;
            });

            service.recordTransition(RateType.ILOC, 1000L, 1001L,
                    WorkflowAction.CREATE, null, RateStatus.DRAFT);

            ArgumentCaptor<Workflow> captor = ArgumentCaptor.forClass(Workflow.class);
            verify(repository).save(captor.capture());
            Workflow saved = captor.getValue();
            assertThat(saved.getRateType()).isEqualTo(RateType.ILOC);
            assertThat(saved.getRateId()).isEqualTo(1000L);
            assertThat(saved.getChangeId()).isEqualTo(1001L);
            assertThat(saved.getAction()).isEqualTo(WorkflowAction.CREATE);
            assertThat(saved.getFromStatus()).isNull();
            assertThat(saved.getToStatus()).isEqualTo(RateStatus.DRAFT);
            assertThat(saved.getMessage()).isNull();
        }

        @Test @DisplayName("Should record transition with message (7-arg overload)")
        void recordWithMessage() {
            when(repository.save(any(Workflow.class))).thenAnswer(inv -> inv.getArgument(0));

            service.recordTransition(RateType.ULOC, 2000L, 2001L,
                    WorkflowAction.REJECT, RateStatus.PENDING, RateStatus.REJECTED,
                    "Rates too high for market conditions");

            ArgumentCaptor<Workflow> captor = ArgumentCaptor.forClass(Workflow.class);
            verify(repository).save(captor.capture());
            Workflow saved = captor.getValue();
            assertThat(saved.getRateType()).isEqualTo(RateType.ULOC);
            assertThat(saved.getFromStatus()).isEqualTo(RateStatus.PENDING);
            assertThat(saved.getToStatus()).isEqualTo(RateStatus.REJECTED);
            assertThat(saved.getMessage()).isEqualTo("Rates too high for market conditions");
        }

        @Test @DisplayName("Should set rateStatus equal to toStatus")
        void rateStatusMatchesToStatus() {
            when(repository.save(any(Workflow.class))).thenAnswer(inv -> inv.getArgument(0));

            service.recordTransition(RateType.ILOC, 1L, 2L,
                    WorkflowAction.APPROVE, RateStatus.PENDING, RateStatus.ACTIVE, null);

            ArgumentCaptor<Workflow> captor = ArgumentCaptor.forClass(Workflow.class);
            verify(repository).save(captor.capture());
            assertThat(captor.getValue().getRateStatus()).isEqualTo(RateStatus.ACTIVE);
        }

        @Test @DisplayName("Should set changeBy to SYSTEM")
        void changeByIsSystem() {
            when(repository.save(any(Workflow.class))).thenAnswer(inv -> inv.getArgument(0));

            service.recordTransition(RateType.ILOC, 1L, 2L,
                    WorkflowAction.CREATE, null, RateStatus.DRAFT);

            ArgumentCaptor<Workflow> captor = ArgumentCaptor.forClass(Workflow.class);
            verify(repository).save(captor.capture());
            assertThat(captor.getValue().getChangeBy()).isEqualTo("SYSTEM");
        }

        @Test @DisplayName("Should set changeOn to non-null timestamp")
        void changeOnIsSet() {
            when(repository.save(any(Workflow.class))).thenAnswer(inv -> inv.getArgument(0));

            service.recordTransition(RateType.ULOC, 1L, 2L,
                    WorkflowAction.SUBMIT, RateStatus.DRAFT, RateStatus.PENDING);

            ArgumentCaptor<Workflow> captor = ArgumentCaptor.forClass(Workflow.class);
            verify(repository).save(captor.capture());
            assertThat(captor.getValue().getChangeOn()).isNotNull();
        }

        @Test @DisplayName("Should record ILOC EXPIRE workflow transition")
        void recordIlocExpire() {
            when(repository.save(any(Workflow.class))).thenAnswer(inv -> inv.getArgument(0));

            service.recordTransition(RateType.ILOC, 900L, 999L,
                    WorkflowAction.EXPIRE, RateStatus.ACTIVE, RateStatus.EXPIRED);

            ArgumentCaptor<Workflow> captor = ArgumentCaptor.forClass(Workflow.class);
            verify(repository).save(captor.capture());
            Workflow saved = captor.getValue();
            assertThat(saved.getAction()).isEqualTo(WorkflowAction.EXPIRE);
            assertThat(saved.getFromStatus()).isEqualTo(RateStatus.ACTIVE);
            assertThat(saved.getToStatus()).isEqualTo(RateStatus.EXPIRED);
        }

        @Test @DisplayName("Should record ULOC APPROVE workflow transition with message")
        void recordUlocApprove() {
            when(repository.save(any(Workflow.class))).thenAnswer(inv -> inv.getArgument(0));

            service.recordTransition(RateType.ULOC, 2000L, 2001L,
                    WorkflowAction.APPROVE, RateStatus.PENDING, RateStatus.ACTIVE,
                    "Approved for Q3 rollout");

            ArgumentCaptor<Workflow> captor = ArgumentCaptor.forClass(Workflow.class);
            verify(repository).save(captor.capture());
            Workflow saved = captor.getValue();
            assertThat(saved.getRateType()).isEqualTo(RateType.ULOC);
            assertThat(saved.getAction()).isEqualTo(WorkflowAction.APPROVE);
            assertThat(saved.getMessage()).isEqualTo("Approved for Q3 rollout");
        }

        @Test @DisplayName("Should record CANCEL transition preserving fromStatus")
        void recordCancel() {
            when(repository.save(any(Workflow.class))).thenAnswer(inv -> inv.getArgument(0));

            service.recordTransition(RateType.ILOC, 1000L, 1001L,
                    WorkflowAction.CANCEL, RateStatus.REJECTED, RateStatus.CANCELLED);

            ArgumentCaptor<Workflow> captor = ArgumentCaptor.forClass(Workflow.class);
            verify(repository).save(captor.capture());
            Workflow saved = captor.getValue();
            assertThat(saved.getFromStatus()).isEqualTo(RateStatus.REJECTED);
            assertThat(saved.getToStatus()).isEqualTo(RateStatus.CANCELLED);
        }

        @Test @DisplayName("Should record ARCHIVE transition for scenario 3")
        void recordArchive() {
            when(repository.save(any(Workflow.class))).thenAnswer(inv -> inv.getArgument(0));

            service.recordTransition(RateType.ILOC, 800L, 800L,
                    WorkflowAction.ARCHIVE, RateStatus.ACTIVE, RateStatus.SUPERSEDED);

            ArgumentCaptor<Workflow> captor = ArgumentCaptor.forClass(Workflow.class);
            verify(repository).save(captor.capture());
            Workflow saved = captor.getValue();
            assertThat(saved.getAction()).isEqualTo(WorkflowAction.ARCHIVE);
            assertThat(saved.getToStatus()).isEqualTo(RateStatus.SUPERSEDED);
        }
    }

    // ================================================================
    // GENERATE CHANGE ID
    // ================================================================
    @Nested @DisplayName("Generate Change ID")
    class GenerateChangeIdTests {
        @Test @DisplayName("Should generate sequential IDs")
        void generateSequentialIds() {
            Long id1 = service.generateChangeId();
            Long id2 = service.generateChangeId();
            assertThat(id2).isGreaterThan(id1);
        }

        @Test @DisplayName("Should generate unique IDs across multiple calls")
        void generateUniqueIds() {
            Long id1 = service.generateChangeId();
            Long id2 = service.generateChangeId();
            Long id3 = service.generateChangeId();
            assertThat(id1).isNotEqualTo(id2);
            assertThat(id2).isNotEqualTo(id3);
        }
    }

    // ================================================================
    // READ OPERATIONS
    // ================================================================
    @Nested @DisplayName("Read Operations")
    class ReadTests {
        @Test @DisplayName("Should find by ID")
        void findById() {
            Workflow w = TestDataFactory.workflow();
            WorkflowAdminView view = TestDataFactory.workflowAdminView();
            when(repository.findById(5000L)).thenReturn(Optional.of(w));
            when(mapper.toAdminView(w)).thenReturn(view);

            WorkflowAdminView result = service.findById(5000L);
            assertThat(result.getId()).isEqualTo(5000L);
        }

        @Test @DisplayName("Should throw when not found")
        void findByIdNotFound() {
            when(repository.findById(999L)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> service.findById(999L))
                    .isInstanceOf(EntityNotFoundException.class);
        }

        @Test @DisplayName("Should findAll without predicate (null binding)")
        void findAllNoPredicate() {
            Page<Workflow> page = new PageImpl<>(List.of(TestDataFactory.workflow()));
            when(binding.buildPredicate(any())).thenReturn(null);
            when(repository.findAll(any(Pageable.class))).thenReturn(page);
            when(mapper.toAdminViewList(any())).thenReturn(List.of(TestDataFactory.workflowAdminView()));

            var result = service.findAll(new HashMap<>(), PageRequest.of(0, 20));
            assertThat(result.getContent()).hasSize(1);
            verify(repository).findAll(any(Pageable.class));
        }

        @Test @DisplayName("Should findAll with predicate (non-null binding)")
        void findAllWithPredicate() {
            BooleanExpression predicate = mock(BooleanExpression.class);
            Pageable pageable = PageRequest.of(0, 20);
            Page<Workflow> page = new PageImpl<>(List.of(TestDataFactory.workflow()));

            when(binding.buildPredicate(any())).thenReturn(predicate);
            when(repository.findAll(predicate, pageable)).thenReturn(page);
            when(mapper.toAdminViewList(any())).thenReturn(List.of(TestDataFactory.workflowAdminView()));

            var result = service.findAll(Map.of("rateType", "ILOC"), pageable);
            assertThat(result.getContent()).hasSize(1);
            verify(repository).findAll(predicate, pageable);
        }

        @Test @DisplayName("Should find by rate type ILOC and rate ID")
        void findByRateTypeIloc() {
            List<Workflow> workflows = List.of(TestDataFactory.workflow());
            when(repository.findByRateTypeAndRateIdOrderByChangeOnDesc(RateType.ILOC, 1000L))
                    .thenReturn(workflows);
            when(mapper.toAdminViewList(workflows))
                    .thenReturn(List.of(TestDataFactory.workflowAdminView()));

            var result = service.findByRateTypeAndRateId(RateType.ILOC, 1000L);
            assertThat(result).hasSize(1);
        }

        @Test @DisplayName("Should find by rate type ULOC and rate ID")
        void findByRateTypeUloc() {
            List<Workflow> workflows = List.of(TestDataFactory.workflow());
            when(repository.findByRateTypeAndRateIdOrderByChangeOnDesc(RateType.ULOC, 2000L))
                    .thenReturn(workflows);
            when(mapper.toAdminViewList(workflows))
                    .thenReturn(List.of(TestDataFactory.workflowAdminView()));

            var result = service.findByRateTypeAndRateId(RateType.ULOC, 2000L);
            assertThat(result).hasSize(1);
        }

        @Test @DisplayName("Should return empty list when no workflows for rate")
        void findByRateTypeEmpty() {
            when(repository.findByRateTypeAndRateIdOrderByChangeOnDesc(RateType.ILOC, 9999L))
                    .thenReturn(Collections.emptyList());
            when(mapper.toAdminViewList(any())).thenReturn(Collections.emptyList());

            var result = service.findByRateTypeAndRateId(RateType.ILOC, 9999L);
            assertThat(result).isEmpty();
        }
    }
}
