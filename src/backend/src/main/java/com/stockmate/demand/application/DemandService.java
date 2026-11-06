package com.stockmate.demand.application;

import java.time.LocalDate;
import com.stockmate.shared.contract.*;

/** Proposed application port, not yet wired to HTTP or persistence.
 * TODO: add server-derived actor/session context before implementation;
 * never accept acting user or role from a request body.
 * Dùng 30 ngày lịch đã hoàn tất theo Asia/Saigon; chia tổng bán cho 30. Phân biệt thiếu dữ liệu với ngày đã xác nhận bán 0.
 */
public interface DemandService {
    // GET /products/{productId}/sales | INVENTORY_PLANNER
    SalesDayList listSales(Long productId, Integer page, Integer pageSize, String search, LocalDate start, LocalDate end);

    // GET /products/{productId}/demand | INVENTORY_PLANNER
    Demand getDemand(Long productId);

}
