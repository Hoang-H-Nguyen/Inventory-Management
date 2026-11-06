/**
 * Persistence/integration adapter location for Tổng quan cho Manager.
 * Data ownership: Truy vấn catalog, replenishment và proposals.
 * TODO: implement adapters, locking/version checks and transactional audit where applicable.
 * Keep external provider calls outside stock/proposal database locks.
 */
package com.stockmate.dashboard.infrastructure;
