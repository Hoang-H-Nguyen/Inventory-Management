/**
 * Persistence/integration adapter location for Sản phẩm, nhà cung cấp và chính sách.
 * Data ownership: PRODUCTS, SUPPLIERS, SUPPLIER_PRODUCTS, REPLENISHMENT_POLICIES.
 * TODO: implement adapters, locking/version checks and transactional audit where applicable.
 * Keep external provider calls outside stock/proposal database locks.
 */
package com.stockmate.catalog.infrastructure;
