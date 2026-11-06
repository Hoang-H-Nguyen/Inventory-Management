package com.stockmate.orders.application;

import com.stockmate.shared.contract.*;

/** Proposed application port, not yet wired to HTTP or persistence.
 * TODO: add server-derived actor/session context before implementation;
 * never accept acting user or role from a request body.
 * Planner ghi đơn thực sự đã đặt/hủy phần còn lại; Staff nhận từng phần. Duyệt đề xuất không tự đặt hàng hoặc tăng on-order.
 */
public interface PlacedOrderService {
    // GET /placed-orders | WAREHOUSE_STAFF, INVENTORY_PLANNER
    PlacedOrderList listPlacedOrders(Integer page, Integer pageSize, String search, String status);

    // POST /placed-orders | INVENTORY_PLANNER
    OrderMutation createPlacedOrder(String idempotencyKey, OrderInput body);

    // GET /placed-orders/{orderId} | WAREHOUSE_STAFF, INVENTORY_PLANNER
    PlacedOrder getPlacedOrder(Long orderId);

    // POST /placed-orders/{orderId}/receipts | WAREHOUSE_STAFF
    OrderMutation receiveOrder(Long orderId, String idempotencyKey, PartialInput body);

    // POST /placed-orders/{orderId}/cancellations | INVENTORY_PLANNER
    OrderMutation cancelOrderRemainder(Long orderId, String idempotencyKey, CancelInput body);

    // GET /placed-orders/{orderId}/history | WAREHOUSE_STAFF, INVENTORY_PLANNER
    AuditEventList listOrderHistory(Long orderId, Integer page, Integer pageSize, String search);

}
