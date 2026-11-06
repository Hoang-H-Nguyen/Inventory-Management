package com.stockmate.users.application;

import com.stockmate.shared.contract.*;

/** Proposed application port, not yet wired to HTTP or persistence.
 * TODO: add server-derived actor/session context before implementation;
 * never accept acting user or role from a request body.
 * Admin không có quyền nghiệp vụ. Không xóa cứng; chặn tự khóa/tự hạ quyền và mất Admin cuối cùng; vô hiệu phiên khi đổi role/status/password.
 */
public interface UserService {
    // GET /users | ADMIN
    UserList listUsers(Integer page, Integer pageSize, String search, String role, Boolean isActive);

    // POST /users | ADMIN
    User createUser(String idempotencyKey, UserCreateInput body);

    // GET /users/{userId} | ADMIN
    User getUser(Long userId);

    // PATCH /users/{userId} | ADMIN
    User updateUser(Long userId, String idempotencyKey, UserUpdateInput body);

    // POST /users/{userId}/reset-password | ADMIN
    User resetUserPassword(Long userId, String idempotencyKey, ResetPasswordInput body);

    // GET /user-activity | ADMIN
    AuditEventList listUserActivity(Integer page, Integer pageSize, String search);

}
