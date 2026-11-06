package com.stockmate.auth.api;

import com.stockmate.shared.contract.*;
import com.stockmate.shared.api.NotImplementedException;
import org.springframework.web.bind.annotation.*;

/** HTTP signatures from docs/openapi/openapi.json. All handlers are deliberate 501 stubs.
 * Roles below document requirements; actual role/ownership checks are not implemented.
 */
@RestController
@RequestMapping("/api/v1")
public class AuthController {
    /** Current identity | Roles: ADMIN, WAREHOUSE_STAFF, INVENTORY_PLANNER, MANAGER. */
    @GetMapping("/me")
    public User getMe() {
        // TODO: authenticate, authorize and delegate to AuthService.
        throw new NotImplementedException("getMe");
    }

    /** Sign in with username and password | Roles: PUBLIC. */
    @PostMapping("/auth/login")
    public AuthSession login(
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody LoginInput body
    ) {
        // TODO: authenticate, authorize and delegate to AuthService.
        throw new NotImplementedException("login");
    }

    /** Revoke the current session | Roles: ADMIN, WAREHOUSE_STAFF, INVENTORY_PLANNER, MANAGER. */
    @PostMapping("/auth/logout")
    public Message logout(@RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey) {
        // TODO: authenticate, authorize and delegate to AuthService.
        throw new NotImplementedException("logout");
    }

    /** Change own password | Roles: ADMIN, WAREHOUSE_STAFF, INVENTORY_PLANNER, MANAGER. */
    @PostMapping("/auth/change-password")
    public AuthSession changePassword(
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody ChangePasswordInput body
    ) {
        // TODO: authenticate, authorize and delegate to AuthService.
        throw new NotImplementedException("changePassword");
    }

}
