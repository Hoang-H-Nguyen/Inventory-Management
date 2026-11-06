# Tồn kho và biến động

Nguồn: US01, US02; C3 trong [C4 architecture](../../../../../../../../docs/c4_architecture/C4_ARCHITECTURE.md).

- `api/`: nhận HTTP, validate và ánh xạ lỗi; hiện là stub 501.
- `application/`: interface use case; cần bổ sung actor/session từ backend trước khi hiện thực.
- `domain/`: entity/value object và invariant cần triển khai.
- `infrastructure/`: vị trí repository JPA, query adapter hoặc Gemini adapter cần triển khai.

Dữ liệu: INVENTORY, STOCK_MOVEMENTS, DAILY_SALES, ACTIVITY_LOG.

Staff ghi bán/kiểm kê; receipt đi qua placed-orders, delivery qua backorders. Ghi stock, outstanding, sales và audit cùng transaction; chống ghi trùng và cập nhật đồng thời.

## Endpoint theo OpenAPI

- `GET /api/v1/inventory` → `listInventory`
- `GET /api/v1/inventory/{productId}` → `getInventory`
- `GET /api/v1/inventory/{productId}/movements` → `listMovements`
- `POST /api/v1/inventory/{productId}/counts` → `recordCount`
- `POST /api/v1/inventory/{productId}/sales` → `recordSale`
