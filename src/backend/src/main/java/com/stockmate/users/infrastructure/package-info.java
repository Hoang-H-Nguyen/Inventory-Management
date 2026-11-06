/**
 * Persistence/integration adapter location for Quản trị tài khoản.
 * Data ownership: USERS, AUTH_SESSIONS, ACTIVITY_LOG.
 * TODO: implement adapters, locking/version checks and transactional audit where applicable.
 * Keep external provider calls outside stock/proposal database locks.
 */
package com.stockmate.users.infrastructure;
