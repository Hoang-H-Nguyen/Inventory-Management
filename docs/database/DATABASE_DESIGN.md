# StockMate — Database Design

Database model for the [project requirements](../../README.md) and [UI/UX flows](../ui_ux/UI_UX_WALKTHROUGH.md). This is a logical design, not a production implementation plan.

## 1. Tables

| Table | Purpose | Example |
|---|---|---|
| USERS | Login identity, password hash, role and account state | Admin, Staff, Planner or Manager |
| AUTH_SESSIONS | Revocable authenticated sessions | Hashed opaque token, expiry and user auth version |
| PRODUCTS | SKU, name and unit | PEN-001, blue pen, piece |
| INVENTORY | Current on-hand stock | 20 pens in the warehouse |
| REPLENISHMENT_POLICIES | Lead time, safety stock and target stock | 4 days, 10 pens, target 100 |
| DAILY_SALES | Sales per product per day | 5 pens sold on a date |
| SUPPLIERS | Supplier information | Supplier A |
| SUPPLIER_PRODUCTS | Supplier-product relationship and price | Supplier A offers PEN-001 at VND5,000 |
| PLACED_ORDERS | Purchases actually placed and quantities received/cancelled | Ordered 80, received 40, still waiting 40 |
| CUSTOMER_BACKORDERS | Unmet customer quantities and deliveries/cancellations | Customer waiting 10, delivered 6, still waiting 4 |
| STOCK_MOVEMENTS | Receipts, sales issues and count adjustments | Receipt of40 pens |
| REPLENISHMENT_PROPOSALS | Proposal header, budget and approval decision | Proposal with a VND500,000 limit |
| REPLENISHMENT_PROPOSAL_ITEMS | Products, suppliers, quantities and calculation details | 80 pens from Supplier A |
| ACTIVITY_LOG | Stock/order changes, proposal edits and decisions | Who changed what, when and why |

There is **one warehouse** and each user has **one role**. A proposal can contain **multiple products and suppliers**.

On-order and backorders are calculated from the corresponding records; users do not directly overwrite these totals. Separate AI session, scheduler and technical retry tables are not required by this logical design.

## 2. Relationships and ER Diagram

- Each product has one inventory record and may have a replenishment policy.
- Products and suppliers have a many-to-many relationship through supplier prices.
- Each product can have many sales records, placed orders, customer backorders and stock movements.
- A proposal has one creator and multiple items. Each item identifies a product and the supplier chosen by the Planner.
- A Manager is recorded when a proposal is approved or rejected.
- A copied draft can refer to the rejected proposal it came from.

~~~mermaid
erDiagram
    USERS {
        bigint id PK
        string username UK
        string password_hash
        string full_name
        string role
        boolean is_active
        boolean must_change_password
        int auth_version
        datetime created_at
        datetime updated_at
    }
    AUTH_SESSIONS {
        bigint id PK
        bigint user_id FK
        string token_hash UK
        int auth_version
        datetime created_at
        datetime expires_at
        datetime revoked_at
    }
    PRODUCTS {
        bigint id PK
        string sku UK
        string name
        string unit
    }
    INVENTORY {
        bigint product_id PK, FK
        int quantity_on_hand
        datetime updated_at
        int version
    }
    REPLENISHMENT_POLICIES {
        bigint product_id PK, FK
        int lead_time_days
        int safety_stock
        int target_stock
    }
    DAILY_SALES {
        bigint id PK
        bigint product_id FK
        date sales_date
        int quantity_sold
    }
    SUPPLIERS {
        bigint id PK
        string name
    }
    SUPPLIER_PRODUCTS {
        bigint id PK
        bigint product_id FK
        bigint supplier_id FK
        decimal unit_price
    }
    PLACED_ORDERS {
        bigint id PK
        string reference
        bigint supplier_product_id FK
        int ordered_quantity
        int received_quantity
        int cancelled_quantity
    }
    CUSTOMER_BACKORDERS {
        bigint id PK
        string reference
        bigint product_id FK
        int requested_quantity
        int fulfilled_quantity
        int cancelled_quantity
    }
    STOCK_MOVEMENTS {
        bigint id PK
        bigint product_id FK
        bigint placed_order_id FK
        bigint backorder_id FK
        string type
        int quantity_change
        bigint recorded_by FK
        datetime recorded_at
        string reason
    }
    REPLENISHMENT_PROPOSALS {
        bigint id PK
        string proposal_code UK
        bigint created_by FK
        bigint reviewed_by FK
        bigint source_proposal_id FK
        string status
        decimal budget
        decimal total_cost
        string rejection_reason
        datetime created_at
        datetime submitted_at
        datetime reviewed_at
        int version
    }
    REPLENISHMENT_PROPOSAL_ITEMS {
        bigint id PK
        bigint proposal_id FK
        bigint supplier_product_id FK
        int suggested_quantity
        int selected_quantity
        decimal unit_price_snapshot
        decimal line_total
        json calculation_snapshot
    }
    ACTIVITY_LOG {
        bigint id PK
        string record_type
        bigint record_id
        string action
        bigint performed_by FK
        datetime performed_at
        string details
    }

    PRODUCTS ||--|| INVENTORY : has
    PRODUCTS ||--o| REPLENISHMENT_POLICIES : configured_by
    PRODUCTS ||--o{ DAILY_SALES : records
    PRODUCTS ||--o{ SUPPLIER_PRODUCTS : priced_by
    SUPPLIERS ||--o{ SUPPLIER_PRODUCTS : supplies
    SUPPLIER_PRODUCTS ||--o{ PLACED_ORDERS : ordered
    PRODUCTS ||--o{ CUSTOMER_BACKORDERS : owed
    PRODUCTS ||--o{ STOCK_MOVEMENTS : changes
    PLACED_ORDERS o|--o{ STOCK_MOVEMENTS : receives
    CUSTOMER_BACKORDERS o|--o{ STOCK_MOVEMENTS : delivers
    USERS ||--o{ AUTH_SESSIONS : authenticates
    USERS ||--o{ STOCK_MOVEMENTS : records
    USERS ||--o{ REPLENISHMENT_PROPOSALS : creates
    USERS o|--o{ REPLENISHMENT_PROPOSALS : reviews
    REPLENISHMENT_PROPOSALS ||--|{ REPLENISHMENT_PROPOSAL_ITEMS : contains
    SUPPLIER_PRODUCTS ||--o{ REPLENISHMENT_PROPOSAL_ITEMS : selected
    REPLENISHMENT_PROPOSALS o|--o{ REPLENISHMENT_PROPOSALS : copied_from
    USERS ||--o{ ACTIVITY_LOG : performs
~~~

The diagram includes account identity and revocable sessions. Store production passwords using an established password-hashing algorithm and tokens only as hashes. Never return password hashes or token hashes in account responses.

## 3. Field Details

### Users and products

User roles are ADMIN, WAREHOUSE_STAFF, INVENTORY_PLANNER and MANAGER. Products use a unique SKU and a consistent unit.

Keep historical users/products available for old records. Admin manages accounts without inheriting stock/proposal permissions.

| Account field | Rule |
|---|---|
| username | Unique, immutable; trim and lowercase; 3–32 letters/digits/periods/underscores/hyphens |
| password_hash | Hash only, never plaintext; support 8–128 character passwords |
| is_active | Locked users cannot authenticate; no account hard deletion |
| must_change_password | True after creation/reset; restrict access to identity/logout/password change until changed |
| auth_version | Increment on password change/reset, role change or active-state change; invalidate prior sessions |
| created_at / updated_at | Account lifecycle timestamps |

Admin assigns temporary passwords through a form; recipients must change them. No public signup/email recovery. Reject self-lock/self-demotion and losing the last active Admin in a consistent transaction. Record actor/target IDs, name snapshots, action and time in ACTIVITY_LOG; never log passwords or bearer tokens. Renaming a user does not rewrite historical actor-name snapshots.

AUTH_SESSIONS links tokens to users with expiry (up to 8 hours) and revocation. Check active state and auth_version for every authenticated request. Logout revokes the current session; password changes/resets and role/status changes invalidate all prior target sessions. A password change issues one replacement session to the current client.

### Inventory and policies

| Field or value | Meaning |
|---|---|
| quantity_on_hand | Stock currently in the warehouse |
| On-order | Sum of ordered − received − cancelled quantities |
| Backorders | Sum of requested − fulfilled − cancelled customer quantities |
| Inventory Position | On-hand + On-order − Backorders |
| lead_time_days | Expected delivery time used for the product's replenishment calculation |
| safety_stock | Buffer stock |
| target_stock | Desired stock level |
| version | Used to detect a competing update |

Planner maintains stock policies through forms. Missing policies must be reported rather than filled with assumed zeros. Inventory Position can be negative even though physical on-hand stock cannot.

### Suppliers, placed orders and customer backorders

SUPPLIER_PRODUCTS stores the price offered for a product. The Planner selects the supplier for each proposal item.

A placed order records a purchase actually placed, not merely an approved proposal. Receipts increase received_quantity and on-hand stock. Cancellation increases cancelled_quantity for the unreceived portion only.

A customer backorder records only the quantity not yet delivered due to a shortage. Delivery increases fulfilled_quantity while reducing stock and the outstanding customer quantity. Cancellation affects only the undelivered portion and does not change stock.

### Daily sales

Store one row per product per day, unique on product_id and sales_date.

- quantity_sold = 0 means the day is known to have no sales.
- Missing data must be distinguished from a confirmed zero.
- Sales issues, including backorder deliveries, contribute once.
- Receipts and count adjustments do not contribute.
- Average daily demand uses the most recent 30 completed calendar days and divides by 30.

The source data must be complete before the system presents a reliable calculation; how days are confirmed can be decided during implementation.

### Proposals and snapshots

The header stores the creator, status, budget, total cost and approval decision. Items store selected products/suppliers, suggested and selected quantities, price and line total.

For each submitted item, preserve the calculation inputs: sales period, average demand, lead time, safety stock, target stock, on-hand/on-order/backorders, Inventory Position and ROP. These can be grouped in calculation_snapshot to keep the logical diagram readable.

Drafts may change. On submission, use current data and let the Planner review any changed calculation before sending. Preserve submitted prices and calculations so later changes do not rewrite the original proposal.

source_proposal_id links a new draft to its rejected original. It does not reopen or overwrite that original.

## 4. Calculation Example

~~~text
Sales over 30 days  = 150 pens
Average demand    = 150 / 30 = 5 pens/day
Lead time         = 4 days
Safety stock      = 10 pens
ROP               = 5 × 4 + 10 = 30 pens

On-hand           = 20
On-order          = 0
Backorders        = 0
Inventory Position = 20 + 0 − 0 = 20

20 <= 30 → Replenishment needed
Target stock      = 100
Suggested quantity = max(0, 100 − 20) = 80 pens

Selected quantity = 80
Supplier price    = VND5,000
Line total        = 80 × 5,000 = VND400,000
Proposal budget   = VND500,000 → Can submit
~~~

If the Planner records an order for 80, on-order becomes80. Receiving 40 increases on-hand to 60 and leaves on-order40. Receiving the last 40 results in stock 100/on-order 0; alternatively, cancelling that 40 leaves stock 60/on-order 0.

This is a single-product example. A multi-item proposal adds the line costs and checks the same proposal budget.

## 5. Proposal status and permissions

~~~text
DRAFT → PENDING → APPROVED
                ↘ REJECTED
~~~

| Status | Meaning | Required information |
|---|---|---|
| DRAFT | Planner is preparing the proposal | Creator, items and budget |
| PENDING | Submitted for review | Complete calculation and submission time |
| APPROVED | Manager accepted it | Reviewer and review time |
| REJECTED | Manager declined it | Reviewer, review time and reason |

Only Admins administer accounts. Only Staff record stock changes. Only Planners prepare/submit proposals and maintain placed orders/backorders. Only Managers approve/reject.

AI can create/edit Drafts only. Rejected proposals can be copied to a new Draft; the old decision remains unchanged.

Approval does not create a purchase order or change stock/on-order.

## 6. Implementation checks

- Keep SKUs unique and quantities valid; prevent receiving/delivering/cancelling more than the remaining amount.
- Update the linked stock, outstanding quantity and sales consistently.
- Do not record the same receipt or sale twice.
- Recalculate after draft changes; block submission if data is missing or total cost exceeds budget.
- Detect competing stock/proposal updates; do not overwrite another user's change silently.
- Prevent processing a proposal twice.
- Record stock/order changes, proposal edits and decisions in the activity history.

### Suggested indexes

| Index | Used for |
|---|---|
| UNIQUE USERS(username) | Account lookup and duplicate prevention |
| UNIQUE AUTH_SESSIONS(token_hash) | Session lookup |
| AUTH_SESSIONS(user_id, expires_at) | Session lifecycle |
| UNIQUE PRODUCTS(sku) | Product lookup |
| UNIQUE DAILY_SALES(product_id, sales_date) | One sales record per product/day |
| UNIQUE SUPPLIER_PRODUCTS(product_id, supplier_id) | Supplier price lookup |
| UNIQUE REPLENISHMENT_PROPOSALS(proposal_code) | Proposal lookup |
| REPLENISHMENT_PROPOSALS(status, submitted_at) | Pending proposals |
| STOCK_MOVEMENTS(product_id, recorded_at) | Stock history |

Choose further indexes when the database and queries are implemented.

## 7. Outside this design

Multiple warehouses, automatic supplier integration, payments/accounting, shared budget funds and a complete sales-order application are outside the MVP.

The customer-backorder record only tracks quantities still owed; it does not require a full CRM or sales module. Technical AI/scheduler storage can be chosen later if needed.

See [Information Architecture](../information_architecture/INFORMATION_ARCHITECTURE.md) and [UI/UX Walkthrough](../ui_ux/UI_UX_WALKTHROUGH.md).
