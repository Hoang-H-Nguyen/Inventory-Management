# StockMate API

[openapi.yaml](./openapi.yaml) and [openapi.json](./openapi.json) describe the same proposed API. The backend is not implemented.

This is a supporting technical draft. The [README](../../README.md) defines project scope; technical fields in the API do not introduce new business modules. Internal retry, AI-service and logging mechanisms can be refined during implementation.

Base path: /api/v1. Login is public; other requests use revocable bearer tokens. Role and account-status checks belong in the backend. Admin has no business permissions by default.

## Endpoints

| Area | Main endpoints | Role |
|---|---|---|
| Login | POST /auth/login | Public |
| Session / password | POST /auth/logout, /auth/change-password; GET /me | All authenticated users |
| Accounts | GET/POST /users; GET/PATCH /users/{userId}; POST .../reset-password; GET /user-activity | Admin |
| Inventory | GET /inventory and /inventory/{productId} | Staff, Planner |
| Stock changes | POST /inventory/{productId}/counts or /sales; GET .../movements | Staff writes; Staff/Planner view |
| Sales and demand | GET /products/{productId}/sales or /demand | Planner |
| Replenishment needs | GET /low-stock and /low-stock/{productId}; check-run endpoints | Planner |
| Products/suppliers/policies | Product, supplier, price and policy endpoints | Planner manages; Staff reads product information |
| Placed orders | Create/view orders; receive or cancel outstanding quantities | Planner creates/cancels; Staff receives |
| Customer backorders | Create/view records; deliver or cancel outstanding quantities | Planner creates/cancels; Staff delivers |
| Draft proposals | Preview, create, view and edit /proposals | Planner; Manager views submitted proposals |
| Proposal decisions | POST .../submit, .../approve or .../reject | Planner submits; Manager decides |
| Rejected copies | POST /proposals/{proposalId}/copy | Planner |
| History | Stock/order/backorder/proposal history endpoints | According to the underlying record's permissions |
| AI assistance | Draft request and result endpoints | Planner; draft creation/editing only |
| Dashboard | GET /dashboard | Manager |

## Account access

Normalize usernames to lowercase. Create accounts with a temporary password and mandatory change on first login. Passwords are 8–128 characters; the new password differs from the current one. No public signup or email delivery. Never return password hashes.

Login issues an opaque revocable bearer token valid up to 8 hours. A user with must_change_password may only use /me, logout and change-password. Logout revokes the current token. Password reset/change, role or active-state changes invalidate prior sessions; password change returns one replacement session to the current client.

Account updates preserve username and historical user IDs. Do not hard-delete users. Reject self-lock/self-demotion and losing the last active Admin. Audit account changes without credentials or token contents. Wrong credentials/locked accounts use generic 401; role/forced-change violations use 403; duplicate username and Admin-invariant conflicts use 409. Throttle login attempts with 429.

The browser prototype simulates these flows locally; it does not call these endpoints or implement production authentication.

## Main flows

**Receive goods:** select a placed order → record received quantity → increase on-hand and reduce on-order together. Allow partial receipts.

**Deliver to a waiting customer:** select the backorder → record delivered quantity → reduce on-hand/backorders and record the sale once.

**Prepare a proposal:** choose products and suppliers → calculate quantities and cost → save/edit Draft → check the budget → Planner submits → Manager approves/rejects. Recalculate after edits and check current data before submission.

**Over budget:** keep the draft editable, show the excess and block submission. The Planner corrects it; no automatic quantity reduction.

**Rejected proposal:** copy to a new Draft; preserve the original.

**AI:** retrieve data and call the same draft calculations/editing functions used by forms. AI cannot submit, approve, record stock movements or place orders. Forms work when AI is unavailable.

## Response rules

- Inventory Position = On-hand + On-order − Backorders; it can be negative.
- Flag a product at Position <= ROP.
- Demand uses the latest 30 completed calendar days; sales history can still be filtered for viewing.
- Report missing data explicitly rather than treating it as zero.
- Errors distinguish invalid input, missing data, over-budget totals, insufficient stock, permission failures and conflicting updates.
- The server owns acting-user identity, decisions and saved calculation history.
- Lists support pagination; empty searches return an empty list.
- Proposed technical currency fields use VND. Taxes, shipping costs and discounts have not been defined as business requirements.

The two specification files are generated from [generate-openapi.mjs](./generate-openapi.mjs). [validate-openapi.mjs](./validate-openapi.mjs) checks internal references, examples and agreement between generated YAML/JSON. These scripts support the API draft; understanding them is not required to follow the business documentation.

Related: [Database Design](../database/DATABASE_DESIGN.md) · [UI/UX Walkthrough](../ui_ux/UI_UX_WALKTHROUGH.md).
