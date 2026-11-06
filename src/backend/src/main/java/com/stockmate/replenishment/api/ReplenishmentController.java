package com.stockmate.replenishment.api;

import com.stockmate.shared.contract.*;
import com.stockmate.shared.api.NotImplementedException;
import org.springframework.web.bind.annotation.*;

/** HTTP signatures from docs/openapi/openapi.json. All handlers are deliberate 501 stubs.
 * Roles below document requirements; actual role/ownership checks are not implemented.
 */
@RestController
@RequestMapping("/api/v1")
public class ReplenishmentController {
    /** Inventory position at or below reorder point | Roles: INVENTORY_PLANNER. */
    @GetMapping("/low-stock")
    public LowStockList listLowStock(
            @RequestParam(value = "page", required = false, defaultValue = "1") Integer page,
            @RequestParam(value = "page_size", required = false, defaultValue = "20") Integer pageSize,
            @RequestParam(value = "search", required = false) String search
    ) {
        // TODO: authenticate, authorize and delegate to ReplenishmentService.
        throw new NotImplementedException("listLowStock");
    }

    /** Explain replenishment status | Roles: INVENTORY_PLANNER. */
    @GetMapping("/low-stock/{productId}")
    public LowStock getLowStockDetail(@PathVariable(value = "productId", required = true) Long productId) {
        // TODO: authenticate, authorize and delegate to ReplenishmentService.
        throw new NotImplementedException("getLowStockDetail");
    }

    /** Daily and manual check runs | Roles: INVENTORY_PLANNER. */
    @GetMapping("/replenishment-runs")
    public RunList listRuns(
            @RequestParam(value = "page", required = false, defaultValue = "1") Integer page,
            @RequestParam(value = "page_size", required = false, defaultValue = "20") Integer pageSize,
            @RequestParam(value = "search", required = false) String search
    ) {
        // TODO: authenticate, authorize and delegate to ReplenishmentService.
        throw new NotImplementedException("listRuns");
    }

    /** Run replenishment check now | Roles: INVENTORY_PLANNER. */
    @PostMapping("/replenishment-runs")
    public Run createManualRun(@RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey) {
        // TODO: authenticate, authorize and delegate to ReplenishmentService.
        throw new NotImplementedException("createManualRun");
    }

}
