// Generated from docs/openapi/openapi.json; edit source schema, then regenerate.
package com.stockmate.shared.contract;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public record Proposal(
        Long id,
        String proposalCode,
        String status,
        Long createdBy,
        Long reviewedBy,
        Long sourceProposalId,
        Long budgetVnd,
        String currency,
        Long totalVnd,
        List<ProposalItem> items,
        Calculation calculation,
        Instant createdAt,
        Instant submittedAt,
        Instant reviewedAt,
        String rejectionReason,
        Integer version
) {}
