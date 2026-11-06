// Generated from docs/openapi/openapi.json; edit source schema, then regenerate.
package com.stockmate.shared.contract;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public record LowStock(
        Inventory inventory,
        Demand demand,
        Integer leadTimeDays,
        Integer safetyStock,
        Integer targetStock,
        BigDecimal reorderPoint,
        Integer suggestedQuantity,
        String status,
        List<String> missingFields,
        Instant checkedAt
) {}
