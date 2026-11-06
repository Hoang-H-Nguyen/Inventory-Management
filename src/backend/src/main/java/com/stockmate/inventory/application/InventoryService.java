package com.stockmate.inventory.application;

import com.stockmate.shared.contract.*;

/** Proposed application port, not yet wired to HTTP or persistence.
 * TODO: add server-derived actor/session context before implementation;
 * never accept acting user or role from a request body.
 * Staff ghi bán/kiểm kê; receipt đi qua placed-orders, delivery qua backorders. Ghi stock, outstanding, sales và audit cùng transaction; chống ghi trùng và cập nhật đồng thời.
 */
public interface InventoryService {
    // GET /inventory | WAREHOUSE_STAFF, INVENTORY_PLANNER
    InventoryList listInventory(Integer page, Integer pageSize, String search);

    // GET /inventory/{productId} | WAREHOUSE_STAFF, INVENTORY_PLANNER
    Inventory getInventory(Long productId);

    // GET /inventory/{productId}/movements | WAREHOUSE_STAFF, INVENTORY_PLANNER
    StockMovementList listMovements(Long productId, Integer page, Integer pageSize, String search);

    // POST /inventory/{productId}/counts | WAREHOUSE_STAFF
    MovementResult recordCount(Long productId, String idempotencyKey, StockCountInput body);

    // POST /inventory/{productId}/sales | WAREHOUSE_STAFF
    MovementResult recordSale(Long productId, String idempotencyKey, SaleInput body);

}
