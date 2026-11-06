// Generated from docs/openapi/openapi.json; edit source schema, then regenerate.
package com.stockmate.shared.contract;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public record PlacedOrder(
        Long id,
        String reference,
        Long productId,
        Long supplierProductId,
        Long proposalItemId,
        Integer orderedQuantity,
        Integer receivedQuantity,
        Integer cancelledQuantity,
        Integer remainingQuantity,
        String status,
        Long createdBy,
        Instant createdAt,
        Integer version
) {}
