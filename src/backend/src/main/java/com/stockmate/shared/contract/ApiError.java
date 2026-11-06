// Generated from docs/openapi/openapi.json; edit source schema, then regenerate.
package com.stockmate.shared.contract;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public record ApiError(
        String code,
        String message,
        List<FieldErrorsItemValue> fieldErrors,
        Integer currentVersion,
        Calculation currentCalculation
) {
    public record FieldErrorsItemValue(
            String field,
            String message
    ) {}

}
