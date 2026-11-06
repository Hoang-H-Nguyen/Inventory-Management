/**
 * Persistence/integration adapter location for Hàng còn nợ khách.
 * Data ownership: CUSTOMER_BACKORDERS, INVENTORY, DAILY_SALES, STOCK_MOVEMENTS, ACTIVITY_LOG.
 * TODO: implement adapters, locking/version checks and transactional audit where applicable.
 * Keep external provider calls outside stock/proposal database locks.
 */
package com.stockmate.backorders.infrastructure;
