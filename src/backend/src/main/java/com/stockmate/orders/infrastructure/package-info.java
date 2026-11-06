/**
 * Persistence/integration adapter location for Đơn mua đã đặt.
 * Data ownership: PLACED_ORDERS, INVENTORY, STOCK_MOVEMENTS, ACTIVITY_LOG.
 * TODO: implement adapters, locking/version checks and transactional audit where applicable.
 * Keep external provider calls outside stock/proposal database locks.
 */
package com.stockmate.orders.infrastructure;
