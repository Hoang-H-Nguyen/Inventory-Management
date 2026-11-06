package com.stockmate.backorders.api;

import com.stockmate.shared.contract.*;
import com.stockmate.shared.api.NotImplementedException;
import org.springframework.web.bind.annotation.*;

/** HTTP signatures from docs/openapi/openapi.json. All handlers are deliberate 501 stubs.
 * Roles below document requirements; actual role/ownership checks are not implemented.
 */
@RestController
@RequestMapping("/api/v1")
public class BackorderController {
    /** Customers waiting due to shortage | Roles: WAREHOUSE_STAFF, INVENTORY_PLANNER. */
    @GetMapping("/backorders")
    public BackorderList listBackorders(
            @RequestParam(value = "page", required = false, defaultValue = "1") Integer page,
            @RequestParam(value = "page_size", required = false, defaultValue = "20") Integer pageSize,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "status", required = false) String status
    ) {
        // TODO: authenticate, authorize and delegate to BackorderService.
        throw new NotImplementedException("listBackorders");
    }

    /** Record unmet customer quantity | Roles: INVENTORY_PLANNER. */
    @PostMapping("/backorders")
    public BackorderMutation createBackorder(
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody BackorderInput body
    ) {
        // TODO: authenticate, authorize and delegate to BackorderService.
        throw new NotImplementedException("createBackorder");
    }

    /** Customer waiting details | Roles: WAREHOUSE_STAFF, INVENTORY_PLANNER. */
    @GetMapping("/backorders/{backorderId}")
    public Backorder getBackorder(@PathVariable(value = "backorderId", required = true) Long backorderId) {
        // TODO: authenticate, authorize and delegate to BackorderService.
        throw new NotImplementedException("getBackorder");
    }

    /** Deliver all or part of a backorder | Roles: WAREHOUSE_STAFF. */
    @PostMapping("/backorders/{backorderId}/fulfilments")
    public BackorderMutation fulfilBackorder(
            @PathVariable(value = "backorderId", required = true) Long backorderId,
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody PartialInput body
    ) {
        // TODO: authenticate, authorize and delegate to BackorderService.
        throw new NotImplementedException("fulfilBackorder");
    }

    /** Cancel unfulfilled customer quantity | Roles: INVENTORY_PLANNER. */
    @PostMapping("/backorders/{backorderId}/cancellations")
    public BackorderMutation cancelBackorder(
            @PathVariable(value = "backorderId", required = true) Long backorderId,
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody CancelInput body
    ) {
        // TODO: authenticate, authorize and delegate to BackorderService.
        throw new NotImplementedException("cancelBackorder");
    }

    /** Customer waiting history | Roles: WAREHOUSE_STAFF, INVENTORY_PLANNER. */
    @GetMapping("/backorders/{backorderId}/history")
    public AuditEventList listBackorderHistory(
            @PathVariable(value = "backorderId", required = true) Long backorderId,
            @RequestParam(value = "page", required = false, defaultValue = "1") Integer page,
            @RequestParam(value = "page_size", required = false, defaultValue = "20") Integer pageSize,
            @RequestParam(value = "search", required = false) String search
    ) {
        // TODO: authenticate, authorize and delegate to BackorderService.
        throw new NotImplementedException("listBackorderHistory");
    }

}
