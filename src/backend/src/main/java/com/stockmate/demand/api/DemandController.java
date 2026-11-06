package com.stockmate.demand.api;

import java.time.LocalDate;
import com.stockmate.shared.contract.*;
import com.stockmate.shared.api.NotImplementedException;
import org.springframework.web.bind.annotation.*;

/** HTTP signatures from docs/openapi/openapi.json. All handlers are deliberate 501 stubs.
 * Roles below document requirements; actual role/ownership checks are not implemented.
 */
@RestController
@RequestMapping("/api/v1")
public class DemandController {
    /** Sales history by date | Roles: INVENTORY_PLANNER. */
    @GetMapping("/products/{productId}/sales")
    public SalesDayList listSales(
            @PathVariable(value = "productId", required = true) Long productId,
            @RequestParam(value = "page", required = false, defaultValue = "1") Integer page,
            @RequestParam(value = "page_size", required = false, defaultValue = "20") Integer pageSize,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "start", required = true) LocalDate start,
            @RequestParam(value = "end", required = true) LocalDate end
    ) {
        // TODO: authenticate, authorize and delegate to DemandService.
        throw new NotImplementedException("listSales");
    }

    /** Average demand over last 30 completed calendar days | Roles: INVENTORY_PLANNER. */
    @GetMapping("/products/{productId}/demand")
    public Demand getDemand(@PathVariable(value = "productId", required = true) Long productId) {
        // TODO: authenticate, authorize and delegate to DemandService.
        throw new NotImplementedException("getDemand");
    }

}
