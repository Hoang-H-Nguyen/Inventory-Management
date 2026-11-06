/**
 * Trợ lý soạn đề xuất (US06).
 * TODO: implement domain models and invariants; API DTOs are not JPA entities.
 * Gemini chỉ tạo/sửa Draft qua service có kiểm quyền và kiểm ownership. Không submit/approve/ghi stock/đặt hàng; không tự giảm số lượng để vừa budget. Form vẫn dùng được khi AI lỗi.
 */
package com.stockmate.ai.domain;
