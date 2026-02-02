package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.Prime;
import com.td.plra.persistence.enums.ActiveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrimeRepository extends JpaRepository<Prime, Long>, QuerydslPredicateExecutor<Prime> {

    List<Prime> findByActive(ActiveStatus active);

    Optional<Prime> findFirstByActiveOrderByCreatedOnDesc(ActiveStatus active);
}
