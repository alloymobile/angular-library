package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.Workflow;
import com.td.plra.persistence.enums.RateStatus;
import com.td.plra.persistence.enums.RateType;
import com.td.plra.persistence.enums.WorkflowAction;
import com.td.plra.testsupport.AuditingTestConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
@Import(AuditingTestConfig.class)
class WorkflowRepositoryTest {

    @Autowired private WorkflowRepository repository;

    @Test
    void workflow_queries_work() {
        Workflow w1 = new Workflow();
        w1.setRateType(RateType.ILOC);
        w1.setRateStatus(RateStatus.DRAFT);
        w1.setAction(WorkflowAction.CREATE);
        w1.setRateId(101L);
        w1.setChangeId("CHG-1");
        w1.setChangedBy("test-user");

        Workflow w2 = new Workflow();
        w2.setRateType(RateType.ULOC);
        w2.setRateStatus(RateStatus.PENDING_APPROVAL);
        w2.setAction(WorkflowAction.SUBMIT);
        w2.setRateId(202L);
        w2.setChangeId("CHG-2");
        w2.setChangedBy("test-user");

        repository.save(w1);
        repository.save(w2);

        assertTrue(repository.findByRateType(RateType.ILOC).isPresent());
        assertEquals(1, repository.findByRateStatus(RateStatus.PENDING_APPROVAL).size());
        assertEquals(1, repository.findByAction(WorkflowAction.CREATE).size());
        assertEquals(1, repository.findByRateId(202L).size());

        List<Workflow> byTypeAndId = repository.findByRateTypeAndRateId(RateType.ULOC, 202L);
        assertEquals(1, byTypeAndId.size());

        assertEquals(1, repository.findByRateTypeAndRateStatus(RateType.ILOC, RateStatus.DRAFT).size());
    }
}
