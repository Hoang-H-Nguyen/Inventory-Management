package com.stockmate.replenishment.infrastructure;

/** Scheduler placeholder, intentionally not enabled or annotated with @Scheduled.
 * TODO: invoke the same application service as createManualRun, use business Clock,
 * coordinate overlapping runs, save run status and surface failures.
 * Never automatically create/submit proposals or place supplier orders.
 */
public final class ReplenishmentScheduler {
    private ReplenishmentScheduler() {}
}
