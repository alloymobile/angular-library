# Rate Management System - Spring Boot JPA Entities

## Overview

This package contains Spring Boot JPA entity classes for the ULOC/ILOC Rate Management System. The entities are designed to work with IBM DB2 database and follow enterprise Java best practices.

## Package Structure

```
com.ratemgmt.entity/
├── base/
│   ├── BaseAuditEntity.java       # Common audit fields (active, created, updated, version)
│   └── BaseRateEntity.java        # Common rate fields (extends BaseAuditEntity)
├── enums/
│   ├── ActiveStatus.java          # Y/N for soft delete
│   ├── NotificationStatus.java    # PENDING, SENT, FAILED, CANCELLED
│   ├── WorkflowAction.java        # CREATE, UPDATE, SUBMIT, APPROVE, etc.
│   ├── WorkflowStatus.java        # DRAFT, PENDING, APPROVED, REJECTED, etc.
│   ├── RateType.java              # ILOC, ULOC
│   ├── DraftStatus.java           # For draft rate tables
│   ├── ActiveRateStatus.java      # For active rate tables
│   ├── HistoryStatus.java         # For history rate tables
│   └── ArchiveReason.java         # EXPIRED, SUPERSEDED, MANUAL, etc.
├── view/
│   ├── VwProductHierarchy.java    # Complete product hierarchy
│   ├── VwIlocCurrentRates.java    # Current ILOC rates
│   ├── VwUlocCurrentRates.java    # Current ULOC rates
│   └── VwPendingApprovals.java    # Pending approvals
├── Product.java                   # Master product table
├── Category.java                  # Product category
├── SubCategory.java               # Product sub-category
├── CvpCode.java                   # CVP code definitions
├── AmountTier.java                # Amount tier ranges
├── Prime.java                     # Prime rate reference
├── Notification.java              # Rate notifications
├── Workflow.java                  # Workflow tracking
├── RateIlocDraft.java             # ILOC draft rates
├── RateIlocActive.java            # ILOC active rates
├── RateIlocHistory.java           # ILOC history rates
├── RateUlocDraft.java             # ULOC draft rates
├── RateUlocActive.java            # ULOC active rates
└── RateUlocHistory.java           # ULOC history rates
```

## Key Features

### 1. Enum-Based Status Fields
All status fields use Java enums with `@Enumerated(EnumType.STRING)` for:
- **Type Safety**: Compile-time checking prevents invalid values
- **Self-Documenting**: Clear meaning of each status
- **Helper Methods**: Built-in methods like `isActive()`, `canBeEdited()`

```java
// Example: ActiveStatus enum for soft delete
@Enumerated(EnumType.STRING)
@Column(name = "ACTIVE", length = 1, nullable = false)
private ActiveStatus active = ActiveStatus.Y;

// Check if record is active
if (entity.getActive().isActive()) { ... }

// Soft delete
entity.setActive(ActiveStatus.N);
```

### 2. Base Entity Classes

**BaseAuditEntity** - Contains common audit fields:
- `active` (ActiveStatus) - Soft delete flag
- `createdBy`, `createdOn` - Creation audit
- `updatedBy`, `updatedOn` - Update audit
- `version` (Integer) - Optimistic locking

**BaseRateEntity** - Extends BaseAuditEntity with rate-specific fields:
- `targetRate`, `floorRate`, `discretion` - Rate values
- `startDate`, `expiryDate` - Validity period
- `amountTier`, `notification`, `workflow` - Relationships

### 3. Soft Delete Pattern

```java
// Soft delete a record
entity.softDelete();  // Sets active = N

// Restore a soft deleted record
entity.restore();     // Sets active = Y

// Check status
entity.isActiveRecord();   // Returns true if active = Y
entity.isArchivedRecord(); // Returns true if active = N
```

### 4. Rate Lifecycle Methods

```java
// Draft operations
draft.submitForApproval();  // DRAFT/REJECTED → PENDING
draft.approve();            // PENDING → APPROVED
draft.reject();             // PENDING → REJECTED

// Active operations
active.suspend();           // ACTIVE → SUSPENDED
active.reactivate();        // SUSPENDED → ACTIVE
active.expire();            // Any → EXPIRED

// Create from transitions
RateIlocActive active = RateIlocActive.fromDraft(approvedDraft);
RateIlocHistory history = RateIlocHistory.fromActiveRate(expiredRate, ArchiveReason.EXPIRED, "system");
```

### 5. View Entities

View entities are marked with `@Immutable` and have no setters:
```java
@Entity
@Immutable
@Table(name = "VW_ILOC_CURRENT_RATES", schema = "RATEMGMT")
public class VwIlocCurrentRates implements Serializable {
    // Only getters, no setters
}
```

## Configuration

### application.properties / application.yml

```yaml
spring:
  datasource:
    url: jdbc:db2://hostname:50000/database
    username: ${DB_USER}
    password: ${DB_PASSWORD}
    driver-class-name: com.ibm.db2.jcc.DB2Driver
  jpa:
    database-platform: org.hibernate.dialect.DB2Dialect
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        default_schema: RATEMGMT
        format_sql: true
```

### Maven Dependencies

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>com.ibm.db2</groupId>
        <artifactId>jcc</artifactId>
        <version>11.5.8.0</version>
    </dependency>
</dependencies>
```

## Usage Examples

### Repository Layer

```java
@Repository
public interface RateIlocActiveRepository extends JpaRepository<RateIlocActive, Long> {
    
    // Find active rates by sub-category
    List<RateIlocActive> findBySubCategoryIdAndActive(Long subCategoryId, ActiveStatus active);
    
    // Find rates expiring soon
    @Query("SELECT r FROM RateIlocActive r WHERE r.active = 'Y' AND r.status = 'ACTIVE' " +
           "AND r.expiryDate BETWEEN :start AND :end")
    List<RateIlocActive> findExpiringSoon(@Param("start") LocalDate start, @Param("end") LocalDate end);
    
    // Find current valid rates
    @Query("SELECT r FROM RateIlocActive r WHERE r.active = 'Y' AND r.status = 'ACTIVE' " +
           "AND :date BETWEEN r.startDate AND r.expiryDate")
    List<RateIlocActive> findValidOnDate(@Param("date") LocalDate date);
}
```

### Service Layer

```java
@Service
@Transactional
public class RateIlocService {
    
    @Autowired
    private RateIlocDraftRepository draftRepository;
    
    @Autowired
    private RateIlocActiveRepository activeRepository;
    
    public void submitForApproval(Long draftId, String userId) {
        RateIlocDraft draft = draftRepository.findById(draftId)
            .orElseThrow(() -> new EntityNotFoundException("Draft not found"));
        
        draft.submitForApproval();
        draft.setUpdatedBy(userId);
        draftRepository.save(draft);
    }
    
    public void approveAndActivate(Long draftId, String userId) {
        RateIlocDraft draft = draftRepository.findById(draftId)
            .orElseThrow(() -> new EntityNotFoundException("Draft not found"));
        
        draft.approve();
        draft.setUpdatedBy(userId);
        draftRepository.save(draft);
        
        // Create active rate from draft
        RateIlocActive active = RateIlocActive.fromDraft(draft);
        active.setCreatedBy(userId);
        activeRepository.save(active);
    }
}
```

## Enum Reference

| Enum | Values | Used In |
|------|--------|---------|
| ActiveStatus | Y, N | All tables (soft delete) |
| NotificationStatus | PENDING, SENT, FAILED, CANCELLED | NOTIFICATION |
| WorkflowAction | CREATE, UPDATE, SUBMIT, APPROVE, REJECT, ACTIVATE, EXPIRE, ARCHIVE, DELETE | WORKFLOW |
| WorkflowStatus | DRAFT, PENDING, APPROVED, REJECTED, ACTIVE, EXPIRED, ARCHIVED | WORKFLOW |
| RateType | ILOC, ULOC | WORKFLOW |
| DraftStatus | DRAFT, PENDING, APPROVED, REJECTED | RATE_*_DRAFT |
| ActiveRateStatus | ACTIVE, EXPIRED, SUSPENDED | RATE_*_ACTIVE |
| HistoryStatus | ARCHIVED, EXPIRED, SUPERSEDED, DELETED | RATE_*_HISTORY |
| ArchiveReason | EXPIRED, SUPERSEDED, MANUAL, CORRECTION, DELETED | RATE_*_HISTORY |

## Files Summary

| Category | Count | Description |
|----------|-------|-------------|
| Enums | 9 | Status and type enumerations |
| Base Classes | 2 | BaseAuditEntity, BaseRateEntity |
| Table Entities | 14 | Product hierarchy + Rate tables |
| View Entities | 4 | Read-only view mappings |
| **Total** | **29** | Java classes |
