package com.stockmate.auth.application;

import com.stockmate.shared.contract.*;

/** Proposed application port, not yet wired to HTTP or persistence.
 * TODO: add server-derived actor/session context before implementation;
 * never accept acting user or role from a request body.
 * Chuẩn hóa username; băm mật khẩu và token; phiên tối đa 8 giờ; đổi mật khẩu tạm; thu hồi phiên. Không dùng JWT thay cho opaque token đã đặc tả.
 */
public interface AuthService {
    // GET /me | ADMIN, WAREHOUSE_STAFF, INVENTORY_PLANNER, MANAGER
    User getMe();

    // POST /auth/login | PUBLIC
    AuthSession login(String idempotencyKey, LoginInput body);

    // POST /auth/logout | ADMIN, WAREHOUSE_STAFF, INVENTORY_PLANNER, MANAGER
    Message logout(String idempotencyKey);

    // POST /auth/change-password | ADMIN, WAREHOUSE_STAFF, INVENTORY_PLANNER, MANAGER
    AuthSession changePassword(String idempotencyKey, ChangePasswordInput body);

}
