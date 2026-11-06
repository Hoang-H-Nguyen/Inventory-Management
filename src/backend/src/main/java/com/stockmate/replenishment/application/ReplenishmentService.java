package com.stockmate.replenishment.application;

import com.stockmate.shared.contract.*;

/** Proposed application port, not yet wired to HTTP or persistence.
 * TODO: add server-derived actor/session context before implementation;
 * never accept acting user or role from a request body.
 * Position = on-hand + on-order - backorders; ROP = demand × lead time + safety stock; cảnh báo khi Position <= ROP; gợi ý max(0, target - Position). Daily và manual dùng chung service.
 */
public interface ReplenishmentService {
    // GET /low-stock | INVENTORY_PLANNER
    LowStockList listLowStock(Integer page, Integer pageSize, String search);

    // GET /low-stock/{productId} | INVENTORY_PLANNER
    LowStock getLowStockDetail(Long productId);

    // GET /replenishment-runs | INVENTORY_PLANNER
    RunList listRuns(Integer page, Integer pageSize, String search);

    // POST /replenishment-runs | INVENTORY_PLANNER
    Run createManualRun(String idempotencyKey);

}
