// Generated from docs/openapi/openapi.json; edit source schema, then regenerate.
package com.stockmate.shared.contract;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public record Calculation(
        Instant asOf,
        LocalDate windowStart,
        LocalDate windowEnd,
        String currency,
        Long budgetVnd,
        Long totalVnd,
        Long overBudgetVnd,
        String status,
        Boolean canSubmit,
        List<String> blockingReasons,
        String fingerprint,
        List<LineCalculation> items
) {}
