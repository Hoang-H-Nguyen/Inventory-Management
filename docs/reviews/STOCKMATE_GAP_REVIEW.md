# StockMate — Project Review

## 1. Purpose

Track coverage of the agreed requirements and identify the remaining implementation work.

## 2. Requirements Coverage

| Area | Documented and prototyped behavior |
|---|---|
| Inventory | Receipts, sales, backorder deliveries and counts, with actor/time/reason |
| Replenishment | Inventory Position, 30 completed days of demand, ROP and missing data |
| Proposals | Multiple products/suppliers, selected quantities, costs and separate budget |
| Decisions | Planner submits own drafts; Manager approves/rejects; rejected copies preserve the original |
| Supporting data | Products, suppliers, prices, policies, placed orders and customer backorders |
| AI | Explained draft-only assistance and a form fallback; AI responses are simulated |
| Authentication | Username/password login, logout, own-password change and mandatory temporary-password change |
| User administration | Dedicated Admin role, create/edit, lock/unlock, temporary passwords, filters and account audit |

## 3. Roles and Account Rules

- Four roles: ADMIN, WAREHOUSE_STAFF, INVENTORY_PLANNER and MANAGER; one role per account.
- Admin manages accounts without inheriting business permissions.
- Username is unique, immutable and normalized to lowercase. No public signup/email recovery.
- New/reset accounts must change their temporary password before using business screens.
- Lock, role change and password reset/change invalidate previous sessions. Preserve user IDs and historical actor-name snapshots.
- Do not hard-delete accounts, permit self-lock/self-demotion or remove the last active Admin.

## 4. Deliverables

The project README and IA define US01–US14. Database design includes USERS and AUTH_SESSIONS. Generated OpenAPI JSON/YAML define account/session contracts. The web prototype and walkthrough demonstrate the four account types with ten representative screenshots.

## 5. Verification

See [prototype verification](../ui_ux/prototype/verification.json) for browser results, including account lifecycle, session invalidation across tabs, draft ownership and inventory/proposal flows. The API validator checks references, role restrictions, safe account schemas, examples and YAML/JSON agreement.

## 6. Remaining Implementation

No backend is implemented. Browser authentication, storage and AI are demonstrations, not production security or services. Production work includes a database, server-side password verification and authorization, revocable sessions with expiry, login throttling, concurrency control, daily replenishment scheduling and actual AI integrations.

The frontend stores password verifiers locally with PBKDF2 but remains editable by the browser user. The API specifies revocable tokens lasting up to eight hours; demo sessions last for the tab lifecycle. These limits are documented in the [prototype guide](../ui_ux/prototype/README.md).

Sources: [Requirements](../../README.md) · [IA](../information_architecture/INFORMATION_ARCHITECTURE.md) · [Business Rules](../BUSINESS_RULES.md) · [API](../api/README.md).
