# Inventory Planner — Screen Catalog

[← Screenshot index](../SCREENSHOT_INDEX.md)

[Common screens](../common/COMMON_SCREENS.md): sign-in, password changes, temporary passwords, sample-data reset confirmation and system states.

Full-page desktop screenshots at 1440 × 1000, numbered by functional flow. Documentation is in English; screenshot contents remain in Vietnamese.

| No. | Screen | Type | Route |
|---:|---|---|---|
| 01 | [Inventory](01-inventory.png) | Screen | `#inventory` |
| 02 | [Product search — no results](02-inventory-empty.png) | State | `#inventory` |
| 03 | [Product details](03-product.png) | Screen | `#product/SKU-001` |
| 04 | [Product without movement history](04-product-no-history.png) | Screen | `#product/SKU-015` |
| 05 | [Demand analysis](05-demand.png) | Screen | `#demand` |
| 06 | [Demand analysis — missing data](06-demand-missing.png) | State | `#demand` |
| 07 | [Invalid date range](07-demand-date-error.png) | State | `#demand` |
| 08 | [Sales history — no results](08-demand-empty.png) | State | `#demand` |
| 09 | [Replenishment alerts](09-alerts.png) | Screen | `#alerts` |
| 10 | [Replenishment basis — stock needed](10-alert.png) | Screen | `#alert/SKU-008` |
| 11 | [Replenishment basis — sufficient stock](11-alert-sufficient.png) | Screen | `#alert/SKU-002` |
| 12 | [Replenishment basis — missing data](12-alert-missing.png) | Screen | `#alert/SKU-015` |
| 13 | [Proposal list](13-proposals.png) | Screen | `#proposals` |
| 14 | [Filter proposals — Draft](14-proposals-draft.png) | State | `#proposals` |
| 15 | [Filter proposals — Pending](15-proposals-pending.png) | State | `#proposals` |
| 16 | [Filter proposals — Approved](16-proposals-approved.png) | State | `#proposals` |
| 17 | [Filter proposals — Rejected](17-proposals-rejected.png) | State | `#proposals` |
| 18 | [Empty proposal list](18-proposals-empty.png) | State | `#proposals` |
| 19 | [Create an empty proposal](19-draft-new.png) | Screen | `#proposal/DX-43` |
| 20 | [Edit draft](20-draft.png) | Screen | `#proposal/DX-042` |
| 21 | [Add a product to the draft](21-draft-add-product.png) | Dialog | `#proposal/DX-042` |
| 22 | [Draft exceeds budget](22-draft-over-budget.png) | State | `#proposal/DX-042` |
| 23 | [AI calculation explanation](23-draft-ai-explain.png) | State | `#proposal/DX-042` |
| 24 | [AI quantity suggestions — not applied](24-draft-ai-suggest.png) | State | `#proposal/DX-042` |
| 25 | [AI suggestions applied](25-draft-ai-applied.png) | Result | `#proposal/DX-042` |
| 26 | [AI unavailable](26-draft-ai-error.png) | State | `#proposal/DX-042` |
| 27 | [Proposal submitted](27-draft-submitted.png) | Result | `#proposal/DX-042` |
| 28 | [Proposal details — Pending](28-proposal-pending.png) | Screen | `#proposal/DX-041` |
| 29 | [Proposal details — Approved](29-proposal-approved.png) | Screen | `#proposal/DX-040` |
| 30 | [Proposal details — Rejected](30-proposal-rejected.png) | Screen | `#proposal/DX-039` |
| 31 | [Copy a rejected proposal](31-draft-copied.png) | Result | `#proposal/DX-43` |
| 32 | [Products and suppliers](32-catalog.png) | Screen | `#catalog` |
| 33 | [Add product](33-product-new.png) | Screen | `#editproduct/new` |
| 34 | [Edit product and stock policy](34-product-edit.png) | Screen | `#editproduct/SKU-001` |
| 35 | [Add supplier](35-supplier-new.png) | Dialog | `#catalog` |
| 36 | [Edit supplier](36-supplier-edit.png) | Dialog | `#catalog` |
| 37 | [Placed orders](37-orders.png) | Screen | `#orders` |
| 38 | [Placed orders — Details](38-orders-detail.png) | Screen | `#record/orders/PO-026` |
| 39 | [Placed orders — Create record](39-orders-new.png) | Screen | `#record/orders/new` |
| 40 | [Placed orders — Cancel outstanding quantity](40-orders-cancel.png) | Dialog | `#record/orders/PO-026` |
| 41 | [Placed orders — Empty list](41-orders-empty.png) | State | `#orders` |
| 42 | [Placed orders — Completed](42-orders-completed.png) | State | `#record/orders/PO-026` |
| 43 | [Customer backorders](43-backorders.png) | Screen | `#backorders` |
| 44 | [Customer backorders — Details](44-backorders-detail.png) | Screen | `#record/backorders/BO-014` |
| 45 | [Customer backorders — Create record](45-backorders-new.png) | Screen | `#record/backorders/new` |
| 46 | [Customer backorders — Cancel outstanding quantity](46-backorders-cancel.png) | Dialog | `#record/backorders/BO-014` |
| 47 | [Customer backorders — Empty list](47-backorders-empty.png) | State | `#backorders` |
| 48 | [Customer backorders — Completed](48-backorders-completed.png) | State | `#record/backorders/BO-014` |
