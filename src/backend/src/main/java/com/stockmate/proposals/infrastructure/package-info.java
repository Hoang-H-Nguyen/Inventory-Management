/**
 * Persistence/integration adapter location for Đề xuất và quyết định phê duyệt.
 * Data ownership: REPLENISHMENT_PROPOSALS, REPLENISHMENT_PROPOSAL_ITEMS, ACTIVITY_LOG.
 * TODO: implement adapters, locking/version checks and transactional audit where applicable.
 * Keep external provider calls outside stock/proposal database locks.
 */
package com.stockmate.proposals.infrastructure;
