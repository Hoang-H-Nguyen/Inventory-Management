// Generated from docs/openapi/openapi.json; edit source schema, then regenerate.
package com.stockmate.shared.contract;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public record UserCreateInput(
        String username,
        String fullName,
        String role,
        String temporaryPassword
) {
    @Override public String toString() { return "UserCreateInput[REDACTED]"; }
}
