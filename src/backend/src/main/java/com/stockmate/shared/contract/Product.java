// Generated from docs/openapi/openapi.json; edit source schema, then regenerate.
package com.stockmate.shared.contract;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public record Product(
        Long id,
        String sku,
        String name,
        String unit,
        Boolean isActive,
        Integer version
) {}
