package com.stockmate.ai.application;

import com.stockmate.shared.contract.*;

/** Proposed application port, not yet wired to HTTP or persistence.
 * TODO: add server-derived actor/session context before implementation;
 * never accept acting user or role from a request body.
 * Gemini chỉ tạo/sửa Draft qua service có kiểm quyền và kiểm ownership. Không submit/approve/ghi stock/đặt hàng; không tự giảm số lượng để vừa budget. Form vẫn dùng được khi AI lỗi.
 */
public interface AiDraftService {
    // POST /ai/draft-requests | INVENTORY_PLANNER
    AIResult createAIDraftRequest(String idempotencyKey, AIInput body);

    // GET /ai/draft-requests/{requestId} | INVENTORY_PLANNER
    AIResult getAIRequest(Long requestId);

}
