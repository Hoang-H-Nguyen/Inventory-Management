# Cảnh báo và đợt kiểm tra bổ sung

Nguồn: US05; C3 trong [C4 architecture](../../../../../../../../docs/c4_architecture/C4_ARCHITECTURE.md).

- `api/`: nhận HTTP, validate và ánh xạ lỗi; hiện là stub 501.
- `application/`: interface use case; cần bổ sung actor/session từ backend trước khi hiện thực.
- `domain/`: entity/value object và invariant cần triển khai.
- `infrastructure/`: vị trí repository JPA, query adapter hoặc Gemini adapter cần triển khai.

Dữ liệu: INVENTORY, PLACED_ORDERS, CUSTOMER_BACKORDERS, DAILY_SALES, REPLENISHMENT_POLICIES; lưu metadata run là lựa chọn triển khai.

Position = on-hand + on-order - backorders; ROP = demand × lead time + safety stock; cảnh báo khi Position <= ROP; gợi ý max(0, target - Position). Daily và manual dùng chung service.

## Endpoint theo OpenAPI

- `GET /api/v1/low-stock` → `listLowStock`
- `GET /api/v1/low-stock/{productId}` → `getLowStockDetail`
- `GET /api/v1/replenishment-runs` → `listRuns`
- `POST /api/v1/replenishment-runs` → `createManualRun`
