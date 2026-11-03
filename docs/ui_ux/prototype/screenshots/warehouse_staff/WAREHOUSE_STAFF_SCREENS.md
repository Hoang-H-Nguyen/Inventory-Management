# Warehouse Staff — Screen Catalog

[← Screenshot index](../SCREENSHOT_INDEX.md)

[Common screens](../common/COMMON_SCREENS.md): sign-in, password changes, temporary passwords, sample-data reset confirmation and system states.

Full-page desktop screenshots at 1440 × 1000, numbered by functional flow. Documentation is in English; screenshot contents remain in Vietnamese.

| No. | Screen | Type | Route |
|---:|---|---|---|
| 01 | [Inventory](01-inventory.png) | Screen | `#inventory` |
| 02 | [Product search — no results](02-inventory-empty.png) | State | `#inventory` |
| 03 | [Product details](03-product.png) | Screen | `#product/SKU-001` |
| 04 | [Product without movement history](04-product-no-history.png) | Screen | `#product/SKU-015` |
| 05 | [Receive goods](05-receipt.png) | Screen | `#stock/SKU-001/receipt` |
| 06 | [Receipt exceeds outstanding quantity](06-receipt-error.png) | State | `#stock/SKU-001/receipt` |
| 07 | [Receipt saved](07-receipt-success.png) | Result | `#product/SKU-001` |
| 08 | [Direct sale](08-sale.png) | Screen | `#stock/SKU-001/sale` |
| 09 | [Deliver a customer backorder](09-backorder-delivery.png) | Screen | `#stock/SKU-001/sale` |
| 10 | [Sale exceeds on-hand stock](10-sale-error.png) | State | `#stock/SKU-001/sale` |
| 11 | [Direct sale saved](11-sale-success.png) | Result | `#product/SKU-001` |
| 12 | [Physical stock count](12-count.png) | Screen | `#stock/SKU-001/count` |
| 13 | [Stock count saved](13-count-success.png) | Result | `#product/SKU-001` |
| 14 | [Placed orders](14-orders.png) | Screen | `#orders` |
| 15 | [Placed orders — Details](15-orders-detail.png) | Screen | `#record/orders/PO-026` |
| 16 | [Placed orders — Empty list](16-orders-empty.png) | State | `#orders` |
| 17 | [Placed orders — Completed](17-orders-completed.png) | State | `#record/orders/PO-026` |
| 18 | [Customer backorders](18-backorders.png) | Screen | `#backorders` |
| 19 | [Customer backorders — Details](19-backorders-detail.png) | Screen | `#record/backorders/BO-014` |
| 20 | [Customer backorders — Empty list](20-backorders-empty.png) | State | `#backorders` |
| 21 | [Customer backorders — Completed](21-backorders-completed.png) | State | `#record/backorders/BO-014` |
