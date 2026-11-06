// Generated from docs/openapi/openapi.json; edit source schema, then regenerate.
package com.stockmate.shared.contract;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public record AuditEvent(
        Long id,
        String entityType,
        Long entityId,
        String action,
        Long actorId,
        String source,
        Map<String, Object> before,
        Map<String, Object> after,
        String reason,
        String reference,
        Long aiRequestId,
        Instant createdAt
) {}
