# Information Architecture — StockMate

## 1. Information Architecture Goal

Organize information around the main business flow:

**Monitor Inventory → Analyze Demand → Identify Replenishment Needs → Prepare a Proposal → Review and Approve**

The system has four roles:

- **Admin:** create/update accounts, assign one role per account, lock/unlock access and issue temporary passwords; no business permissions by default.

- **Warehouse Staff:** view stock and record receipts, sales issues and count adjustments.
- **Inventory Planner:** manage planning data, track outstanding quantities and prepare proposals through forms or AI.
- **Manager:** monitor the dashboard and approve or reject proposals.

## 2. Sitemap

~~~mermaid
flowchart TD
    ROOT["StockMate"]
    ROOT --> LOGIN["Login / Logout / Change Password"]
    ROOT --> USERS["User Administration — Admin"]
    USERS --> USERFORM["Create / Edit / Lock / Unlock / Reset Password"]
    ROOT --> DASH["1. Dashboard"]
    ROOT --> INV["2. Inventory"]
    ROOT --> DEMAND["3. Demand Analysis"]
    ROOT --> LOW["4. Low-stock Alerts"]
    ROOT --> REP["5. Replenishment Proposals"]
    ROOT --> CATALOG["6. Products and Suppliers"]
    ROOT --> RECORDS["7. Placed Orders and Backorders"]

    DASH --> OVERVIEW["Overview: SKUs, Alerts, Pending Proposals"]
    INV --> INV_LIST["Inventory List and Search"]
    INV_LIST --> INV_DETAIL["Product Inventory Detail"]
    INV_DETAIL --> INV_UPDATE["Receipt / Sales Issue / Count Adjustment"]
    INV_DETAIL --> HISTORY["Stock Change History"]

    DEMAND --> SALES["Sales History and Date Filter"]
    DEMAND --> AVG["Average Daily Demand: Last 30 Days"]
    LOW --> LOW_LIST["Replenishment Needs"]
    LOW_LIST --> LOW_DETAIL["Position, ROP and Suggested Quantity"]
    LOW_DETAIL --> CREATE["Prepare Proposal"]

    REP --> REP_LIST["Proposal List and Status Filter"]
    REP_LIST --> REP_DETAIL["Proposal Detail"]
    REP_DETAIL --> DRAFT["Edit Draft through Form or AI"]
    REP_DETAIL --> SUBMIT["Planner: Submit"]
    REP_DETAIL --> APPROVE["Manager: Approve"]
    REP_DETAIL --> REJECT["Manager: Reject with Reason"]
    REP_DETAIL --> COPY["Copy Rejected Proposal to New Draft"]

    CATALOG --> DATA["Products / Suppliers / Prices / Stock Policies"]
    RECORDS --> ORDERS["Placed Orders: Create / Receive / Cancel Remainder"]
    RECORDS --> BACKORDERS["Backorders: Create / Deliver / Cancel Remainder"]
~~~

## 3. Screen Hierarchy

~~~text
StockMate
├── Login / Logout / Change Password               [All users]
│   └── Mandatory password change for temporary credentials
├── User Administration                           [Admin]
│   ├── Search/filter accounts by role and active status
│   └── Create / Edit / Lock / Unlock / Reset password
├── Dashboard                                      [Manager]
│   └── Total SKUs, replenishment alerts, pending proposals
├── Inventory                                      [Staff, Planner]
│   ├── List and search
│   └── Product detail
│       ├── On-hand, on-order, backorders and Inventory Position
│       ├── Record receipt, sale or count adjustment [Staff]
│       └── Stock change history
├── Demand Analysis                                [Planner]
│   ├── Sales history with date filters
│   └── Average daily demand over the latest 30 completed days
├── Low-stock Alerts                               [Planner]
│   ├── Replenishment needs list
│   └── Detail: Position, ROP, lead time, safety stock and target
├── Replenishment Proposals                        [Planner, Manager]
│   ├── List and status filter
│   └── Detail
│       ├── Products, suppliers, quantities, costs and budget
│       ├── Form editor and AI draft assistant       [Planner]
│       ├── Review and submit                       [Planner]
│       ├── Approve or reject with reason           [Manager]
│       ├── Copy rejected proposal to new draft     [Planner]
│       └── Edit and decision history
├── Products and Suppliers                         [Planner]
│   └── Product details, supplier prices and stock policies
└── Placed Orders and Backorders
    ├── Create and cancel outstanding quantities   [Planner]
    └── Record receipts and customer deliveries    [Staff]
~~~

## 4. Role-based Navigation

| Area | Warehouse Staff | Inventory Planner | Manager | Admin |
|---|---|---|---|---|
| Login / Logout / Own Password | Own account | Own account | Own account | Own account |
| Dashboard | — | — | View | — |
| Inventory | View; record stock changes | View | — | — |
| Sales History / Demand Analysis | — | View | — | — |
| Low-stock Alerts | — | View; check needs | — | — |
| Replenishment Proposals | — | Own drafts; view submitted; prepare, edit, submit and copy | View submitted; approve/reject | — |
| Products and Suppliers | Product information needed for stock work | Manage products, suppliers, prices and policies | Proposal information | — |
| Placed Orders / Backorders | View; receive/deliver | Create, view and cancel remainder | — | — |
| User Administration | — | — | — | Create/edit, assign role, lock/unlock and reset password |

### Suggested Main Menus

- **Admin:** User Administration.
- **All users:** Change Password, Logout; unauthenticated users see Login.
- **Staff:** Inventory, Placed Orders, Customer Backorders.
- **Planner:** Inventory, Demand Analysis, Low-stock Alerts, Proposals, Products and Suppliers, Placed Orders, Customer Backorders.
- **Manager:** Dashboard, Proposals.

## 5. Important Cross-links

- Dashboard Pending Proposals opens the filtered proposal list.
- Selecting a SKU opens its relevant inventory, demand or alert detail.
- Low-stock Detail opens proposal preparation.
- A draft can be edited through forms or the AI assistant; only the Planner submits it.
- A receipt links to its placed order; a customer delivery links to its backorder.
- After approval/rejection, remain on Proposal Detail and display the decision.
- Copying a rejected proposal opens a new draft and keeps a link to the original.

## 6. Proposal Status Rules

~~~mermaid
stateDiagram-v2
    [*] --> Draft: Planner prepares a proposal
    Draft --> Pending: Planner submits
    Pending --> Approved: Manager approves
    Pending --> Rejected: Manager rejects
~~~

Drafts are saved so the Planner can review them. AI may only create/edit Drafts. A rejected proposal remains unchanged; copying creates a separate new Draft.

Approval does not place a supplier order. On-order increases only when the Planner records a purchase actually placed.

## 7. MVP Scope and Exclusions

This architecture covers US01–US14. Dashboard is Should Have; the other stories are Must Have.

Forms support products/suppliers, receipts, sales, counts, placed orders, backorders and proposal preparation. Partial receipts/deliveries and cancellation of outstanding quantities are included. Stock changes and proposal decisions retain history.

Automatic supplier integration, payments/accounting, shared budget funds, multiple warehouses are outside the MVP.

Login, logout, password change and User Administration are included. Temporary passwords require a change before entering the workspace. Access Denied and Not Found are supporting pages. Locked accounts cannot log in; username is immutable. Preserve historical users, prevent self-lock/self-demotion, and retain at least one active Admin.

See [Project Requirements](../../README.md) and [Business Rules](../requirements/BUSINESS_RULES.md).
