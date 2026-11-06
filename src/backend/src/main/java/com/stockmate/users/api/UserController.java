package com.stockmate.users.api;

import com.stockmate.shared.contract.*;
import com.stockmate.shared.api.NotImplementedException;
import org.springframework.web.bind.annotation.*;

/** HTTP signatures from docs/openapi/openapi.json. All handlers are deliberate 501 stubs.
 * Roles below document requirements; actual role/ownership checks are not implemented.
 */
@RestController
@RequestMapping("/api/v1")
public class UserController {
    /** Search and filter accounts | Roles: ADMIN. */
    @GetMapping("/users")
    public UserList listUsers(
            @RequestParam(value = "page", required = false, defaultValue = "1") Integer page,
            @RequestParam(value = "page_size", required = false, defaultValue = "20") Integer pageSize,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "role", required = false) String role,
            @RequestParam(value = "is_active", required = false) Boolean isActive
    ) {
        // TODO: authenticate, authorize and delegate to UserService.
        throw new NotImplementedException("listUsers");
    }

    /** Create an active account with temporary password | Roles: ADMIN. */
    @PostMapping("/users")
    public User createUser(
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody UserCreateInput body
    ) {
        // TODO: authenticate, authorize and delegate to UserService.
        throw new NotImplementedException("createUser");
    }

    /** Account details | Roles: ADMIN. */
    @GetMapping("/users/{userId}")
    public User getUser(@PathVariable(value = "userId", required = true) Long userId) {
        // TODO: authenticate, authorize and delegate to UserService.
        throw new NotImplementedException("getUser");
    }

    /** Update name, role or active state | Roles: ADMIN. */
    @PatchMapping("/users/{userId}")
    public User updateUser(
            @PathVariable(value = "userId", required = true) Long userId,
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody UserUpdateInput body
    ) {
        // TODO: authenticate, authorize and delegate to UserService.
        throw new NotImplementedException("updateUser");
    }

    /** Assign a temporary password | Roles: ADMIN. */
    @PostMapping("/users/{userId}/reset-password")
    public User resetUserPassword(
            @PathVariable(value = "userId", required = true) Long userId,
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody ResetPasswordInput body
    ) {
        // TODO: authenticate, authorize and delegate to UserService.
        throw new NotImplementedException("resetUserPassword");
    }

    /** Account activity history | Roles: ADMIN. */
    @GetMapping("/user-activity")
    public AuditEventList listUserActivity(
            @RequestParam(value = "page", required = false, defaultValue = "1") Integer page,
            @RequestParam(value = "page_size", required = false, defaultValue = "20") Integer pageSize,
            @RequestParam(value = "search", required = false) String search
    ) {
        // TODO: authenticate, authorize and delegate to UserService.
        throw new NotImplementedException("listUserActivity");
    }

}
