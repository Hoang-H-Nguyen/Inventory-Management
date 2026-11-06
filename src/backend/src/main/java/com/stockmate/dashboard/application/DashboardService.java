package com.stockmate.dashboard.application;

import com.stockmate.shared.contract.*;

/** Proposed application port, not yet wired to HTTP or persistence.
 * TODO: add server-derived actor/session context before implementation;
 * never accept acting user or role from a request body.
 * Chỉ Manager. Đếm SKU active, cần bổ sung, thiếu dữ liệu và Pending; không suy diễn thiếu dữ liệu thành đủ hàng.
 */
public interface DashboardService {
    // GET /dashboard | MANAGER
    Dashboard getDashboard();

}
