package com.stockmate.audit.application;

import com.stockmate.shared.contract.AuditEvent;

/** Internal audit port; implementation must join the business transaction.
 * Build actor/name snapshots from trusted server context. Never include credentials.
 */
public interface AuditService {
    void record(AuditEvent event);
}
