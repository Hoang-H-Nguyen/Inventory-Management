// Generated from docs/openapi/openapi.json; edit source schema, then regenerate.
package com.stockmate.shared.contract;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public record Inventory(
        Product product,
        Integer quantityOnHand,
        Integer quantityOnOrder,
        Integer backorders,
        Long inventoryPosition,
        Instant updatedAt,
        Integer version,
        PolicyValue policy,
        String dataStatus,
        List<String> missingFields
) {
    public record PolicyValue(
            Long productId,
            Integer leadTimeDays,
            Integer safetyStock,
            Integer targetStock,
            Integer version
    ) {}

}
