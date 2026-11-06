// Generated from docs/openapi/openapi.json; edit source schema, then regenerate.
package com.stockmate.shared.contract;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public record Backorder(
        Long id,
        String reference,
        Long productId,
        Integer requestedQuantity,
        Integer fulfilledQuantity,
        Integer cancelledQuantity,
        Integer remainingQuantity,
        String status,
        Long createdBy,
        Instant createdAt,
        Integer version
) {}
