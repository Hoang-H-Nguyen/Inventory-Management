// Generated from docs/openapi/openapi.json; edit source schema, then regenerate.
package com.stockmate.shared.contract;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public record AIResult(
        Long id,
        String status,
        Long proposalId,
        Integer proposalVersion,
        String message,
        List<String> changedFields,
        List<ToolCallsItemValue> toolCalls,
        String errorCode,
        Instant createdAt
) {
    public record ToolCallsItemValue(
            String name,
            String status
    ) {}

}
