/**
 * Lịch sử hoạt động (US02, US07, US12, US14).
 * TODO: implement domain models and invariants; API DTOs are not JPA entities.
 * Audit ghi cùng transaction nghiệp vụ; lưu actor/target và tên lịch sử, timestamp, reason, snapshot. Không ghi mật khẩu, token hoặc credential hash.
 */
package com.stockmate.audit.domain;
