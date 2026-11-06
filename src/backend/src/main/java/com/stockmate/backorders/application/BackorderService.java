package com.stockmate.backorders.application;

import com.stockmate.shared.contract.*;

/** Proposed application port, not yet wired to HTTP or persistence.
 * TODO: add server-derived actor/session context before implementation;
 * never accept acting user or role from a request body.
 * Planner tạo/hủy phần chưa giao; Staff giao từng phần. Giao giảm stock và nợ khách, ghi đúng một sale; hủy không đổi stock.
 */
public interface BackorderService {
    // GET /backorders | WAREHOUSE_STAFF, INVENTORY_PLANNER
    BackorderList listBackorders(Integer page, Integer pageSize, String search, String status);

    // POST /backorders | INVENTORY_PLANNER
    BackorderMutation createBackorder(String idempotencyKey, BackorderInput body);

    // GET /backorders/{backorderId} | WAREHOUSE_STAFF, INVENTORY_PLANNER
    Backorder getBackorder(Long backorderId);

    // POST /backorders/{backorderId}/fulfilments | WAREHOUSE_STAFF
    BackorderMutation fulfilBackorder(Long backorderId, String idempotencyKey, PartialInput body);

    // POST /backorders/{backorderId}/cancellations | INVENTORY_PLANNER
    BackorderMutation cancelBackorder(Long backorderId, String idempotencyKey, CancelInput body);

    // GET /backorders/{backorderId}/history | WAREHOUSE_STAFF, INVENTORY_PLANNER
    AuditEventList listBackorderHistory(Long backorderId, Integer page, Integer pageSize, String search);

}
