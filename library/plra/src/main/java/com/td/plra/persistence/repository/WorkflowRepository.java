package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.Workflow;
import com.td.plra.persistence.enums.RateStatus;
import com.td.plra.persistence.enums.RateType;
import com.td.plra.persistence.enums.WorkflowAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkflowRepository extends JpaRepository<Workflow, Long>, QuerydslPredicateExecutor<Workflow> {

    Optional<Workflow> findByRateType(RateType rateType);

    List<Workflow> findByRateStatus(RateStatus rateStatus);

    List<Workflow> findByAction(WorkflowAction action);

    List<Workflow> findByRateTypeAndRateStatus(RateType rateType, RateStatus rateStatus);

    List<Workflow> findByRateId(Long rateId);

    List<Workflow> findByRateTypeAndRateId(RateType rateType, Long rateId);
}
