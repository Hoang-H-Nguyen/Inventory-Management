// Generated from docs/openapi/openapi.json; edit source schema, then regenerate.
package com.stockmate.shared.contract;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public record Demand(
        Long productId,
        LocalDate windowStart,
        LocalDate windowEnd,
        Integer observedDays,
        BigDecimal averageDailyDemand,
        String status,
        List<LocalDate> missingDates
) {}
