// Generated from docs/openapi/openapi.json; edit source schema, then regenerate.
package com.stockmate.shared.contract;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public record StockMovement(
        Long id,
        Long productId,
        String type,
        Integer quantityDelta,
        Integer quantityBefore,
        Integer quantityAfter,
        Long placedOrderId,
        Long backorderId,
        Long actorId,
        String reason,
        String reference,
        Instant createdAt
) {}
