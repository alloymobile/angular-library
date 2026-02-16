package com.td.plra.application.utils;

import org.springframework.data.domain.Pageable;

import java.util.Map;

/**
 * Utility class for pagination operations.
 */
public final class PaginationUtils {
    
    private PaginationUtils() {
        // Utility class - no instantiation
    }
    
    /**
     * Resolves the pageable based on request parameters.
     * If 'unpaged=true' is present, returns Pageable.unpaged().
     * Otherwise, returns the provided default pageable.
     *
     * @param params     Request parameters map
     * @param pageable   Default pageable from @PageableDefault
     * @return Pageable.unpaged() if unpaged=true, otherwise the default pageable
     */
    public static Pageable resolvePageable(Map<String, String> params, Pageable pageable) {
        String unpaged = params.get("unpaged");
        if ("true".equalsIgnoreCase(unpaged)) {
            return Pageable.unpaged();
        }
        return pageable;
    }
    
    /**
     * Checks if the request is for unpaged results.
     *
     * @param params Request parameters map
     * @return true if unpaged=true, false otherwise
     */
    public static boolean isUnpaged(Map<String, String> params) {
        String unpaged = params.get("unpaged");
        return "true".equalsIgnoreCase(unpaged);
    }
}
