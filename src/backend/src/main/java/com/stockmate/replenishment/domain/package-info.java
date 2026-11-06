/**
 * Cảnh báo và đợt kiểm tra bổ sung (US05).
 * TODO: implement domain models and invariants; API DTOs are not JPA entities.
 * Position = on-hand + on-order - backorders; ROP = demand × lead time + safety stock; cảnh báo khi Position <= ROP; gợi ý max(0, target - Position). Daily và manual dùng chung service.
 */
package com.stockmate.replenishment.domain;
