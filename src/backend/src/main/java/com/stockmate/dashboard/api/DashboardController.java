package com.stockmate.dashboard.api;

import com.stockmate.shared.contract.*;
import com.stockmate.shared.api.NotImplementedException;
import org.springframework.web.bind.annotation.*;

/** HTTP signatures from docs/openapi/openapi.json. All handlers are deliberate 501 stubs.
 * Roles below document requirements; actual role/ownership checks are not implemented.
 */
@RestController
@RequestMapping("/api/v1")
public class DashboardController {
    /** Manager summary | Roles: MANAGER. */
    @GetMapping("/dashboard")
    public Dashboard getDashboard() {
        // TODO: authenticate, authorize and delegate to DashboardService.
        throw new NotImplementedException("getDashboard");
    }

}
