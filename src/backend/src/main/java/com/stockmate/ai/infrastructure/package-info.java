/**
 * Persistence/integration adapter location for Trợ lý soạn đề xuất.
 * Data ownership: Không truy cập DB trực tiếp; gọi service demand/catalog/proposals.
 * TODO: implement adapters, locking/version checks and transactional audit where applicable.
 * Keep external provider calls outside stock/proposal database locks.
 */
package com.stockmate.ai.infrastructure;
