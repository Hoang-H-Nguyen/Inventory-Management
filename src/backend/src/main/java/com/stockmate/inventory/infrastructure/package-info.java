/**
 * Persistence/integration adapter location for Tồn kho và biến động.
 * Data ownership: INVENTORY, STOCK_MOVEMENTS, DAILY_SALES, ACTIVITY_LOG.
 * TODO: implement adapters, locking/version checks and transactional audit where applicable.
 * Keep external provider calls outside stock/proposal database locks.
 */
package com.stockmate.inventory.infrastructure;
