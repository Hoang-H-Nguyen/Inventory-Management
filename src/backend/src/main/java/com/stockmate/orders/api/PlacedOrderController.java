package com.stockmate.orders.api;

import com.stockmate.shared.contract.*;
import com.stockmate.shared.api.NotImplementedException;
import org.springframework.web.bind.annotation.*;

/** HTTP signatures from docs/openapi/openapi.json. All handlers are deliberate 501 stubs.
 * Roles below document requirements; actual role/ownership checks are not implemented.
 */
@RestController
@RequestMapping("/api/v1")
public class PlacedOrderController {
    /** Placed order tracking | Roles: WAREHOUSE_STAFF, INVENTORY_PLANNER. */
    @GetMapping("/placed-orders")
    public PlacedOrderList listPlacedOrders(
            @RequestParam(value = "page", required = false, defaultValue = "1") Integer page,
            @RequestParam(value = "page_size", required = false, defaultValue = "20") Integer pageSize,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "status", required = false) String status
    ) {
        // TODO: authenticate, authorize and delegate to PlacedOrderService.
        throw new NotImplementedException("listPlacedOrders");
    }

    /** Record an order actually placed | Roles: INVENTORY_PLANNER. */
    @PostMapping("/placed-orders")
    public OrderMutation createPlacedOrder(
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody OrderInput body
    ) {
        // TODO: authenticate, authorize and delegate to PlacedOrderService.
        throw new NotImplementedException("createPlacedOrder");
    }

    /** Placed order details | Roles: WAREHOUSE_STAFF, INVENTORY_PLANNER. */
    @GetMapping("/placed-orders/{orderId}")
    public PlacedOrder getPlacedOrder(@PathVariable(value = "orderId", required = true) Long orderId) {
        // TODO: authenticate, authorize and delegate to PlacedOrderService.
        throw new NotImplementedException("getPlacedOrder");
    }

    /** Receive all or part of an order | Roles: WAREHOUSE_STAFF. */
    @PostMapping("/placed-orders/{orderId}/receipts")
    public OrderMutation receiveOrder(
            @PathVariable(value = "orderId", required = true) Long orderId,
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody PartialInput body
    ) {
        // TODO: authenticate, authorize and delegate to PlacedOrderService.
        throw new NotImplementedException("receiveOrder");
    }

    /** Cancel unreceived quantity | Roles: INVENTORY_PLANNER. */
    @PostMapping("/placed-orders/{orderId}/cancellations")
    public OrderMutation cancelOrderRemainder(
            @PathVariable(value = "orderId", required = true) Long orderId,
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody CancelInput body
    ) {
        // TODO: authenticate, authorize and delegate to PlacedOrderService.
        throw new NotImplementedException("cancelOrderRemainder");
    }

    /** Placed order history | Roles: WAREHOUSE_STAFF, INVENTORY_PLANNER. */
    @GetMapping("/placed-orders/{orderId}/history")
    public AuditEventList listOrderHistory(
            @PathVariable(value = "orderId", required = true) Long orderId,
            @RequestParam(value = "page", required = false, defaultValue = "1") Integer page,
            @RequestParam(value = "page_size", required = false, defaultValue = "20") Integer pageSize,
            @RequestParam(value = "search", required = false) String search
    ) {
        // TODO: authenticate, authorize and delegate to PlacedOrderService.
        throw new NotImplementedException("listOrderHistory");
    }

}
