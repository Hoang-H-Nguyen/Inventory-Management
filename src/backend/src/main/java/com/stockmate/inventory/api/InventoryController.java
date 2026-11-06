package com.stockmate.inventory.api;

import com.stockmate.shared.contract.*;
import com.stockmate.shared.api.NotImplementedException;
import org.springframework.web.bind.annotation.*;

/** HTTP signatures from docs/openapi/openapi.json. All handlers are deliberate 501 stubs.
 * Roles below document requirements; actual role/ownership checks are not implemented.
 */
@RestController
@RequestMapping("/api/v1")
public class InventoryController {
    /** Search inventory | Roles: WAREHOUSE_STAFF, INVENTORY_PLANNER. */
    @GetMapping("/inventory")
    public InventoryList listInventory(
            @RequestParam(value = "page", required = false, defaultValue = "1") Integer page,
            @RequestParam(value = "page_size", required = false, defaultValue = "20") Integer pageSize,
            @RequestParam(value = "search", required = false) String search
    ) {
        // TODO: authenticate, authorize and delegate to InventoryService.
        throw new NotImplementedException("listInventory");
    }

    /** Inventory detail | Roles: WAREHOUSE_STAFF, INVENTORY_PLANNER. */
    @GetMapping("/inventory/{productId}")
    public Inventory getInventory(@PathVariable(value = "productId", required = true) Long productId) {
        // TODO: authenticate, authorize and delegate to InventoryService.
        throw new NotImplementedException("getInventory");
    }

    /** Stock history | Roles: WAREHOUSE_STAFF, INVENTORY_PLANNER. */
    @GetMapping("/inventory/{productId}/movements")
    public StockMovementList listMovements(
            @PathVariable(value = "productId", required = true) Long productId,
            @RequestParam(value = "page", required = false, defaultValue = "1") Integer page,
            @RequestParam(value = "page_size", required = false, defaultValue = "20") Integer pageSize,
            @RequestParam(value = "search", required = false) String search
    ) {
        // TODO: authenticate, authorize and delegate to InventoryService.
        throw new NotImplementedException("listMovements");
    }

    /** Record physical count adjustment | Roles: WAREHOUSE_STAFF. */
    @PostMapping("/inventory/{productId}/counts")
    public MovementResult recordCount(
            @PathVariable(value = "productId", required = true) Long productId,
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody StockCountInput body
    ) {
        // TODO: authenticate, authorize and delegate to InventoryService.
        throw new NotImplementedException("recordCount");
    }

    /** Record an ordinary sale | Roles: WAREHOUSE_STAFF. */
    @PostMapping("/inventory/{productId}/sales")
    public MovementResult recordSale(
            @PathVariable(value = "productId", required = true) Long productId,
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody SaleInput body
    ) {
        // TODO: authenticate, authorize and delegate to InventoryService.
        throw new NotImplementedException("recordSale");
    }

}
