package com.td.plra.common;

import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

/**
 * Base class for repository integration tests.
 * Uses H2 in-memory database with test profile.
 */
@DataJpaTest
@ActiveProfiles("test")
@Import(TestJpaConfig.class)
public abstract class BaseRepositoryTest {
    
    protected static final Long TEST_ID = 1L;
    protected static final String TEST_USER = "test-user";
}
