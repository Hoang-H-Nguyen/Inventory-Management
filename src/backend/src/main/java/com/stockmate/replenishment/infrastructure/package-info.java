/**
 * Persistence/integration adapter location for Cảnh báo và đợt kiểm tra bổ sung.
 * Data ownership: INVENTORY, PLACED_ORDERS, CUSTOMER_BACKORDERS, DAILY_SALES, REPLENISHMENT_POLICIES; lưu metadata run là lựa chọn triển khai.
 * TODO: implement adapters, locking/version checks and transactional audit where applicable.
 * Keep external provider calls outside stock/proposal database locks.
 */
package com.stockmate.replenishment.infrastructure;
