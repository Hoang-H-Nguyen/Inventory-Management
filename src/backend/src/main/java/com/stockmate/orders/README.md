# Đơn mua đã đặt

Nguồn: US12, US02; C3 trong [C4 architecture](../../../../../../../../docs/c4_architecture/C4_ARCHITECTURE.md).

- `api/`: nhận HTTP, validate và ánh xạ lỗi; hiện là stub 501.
- `application/`: interface use case; cần bổ sung actor/session từ backend trước khi hiện thực.
- `domain/`: entity/value object và invariant cần triển khai.
- `infrastructure/`: vị trí repository JPA, query adapter hoặc Gemini adapter cần triển khai.

Dữ liệu: PLACED_ORDERS, INVENTORY, STOCK_MOVEMENTS, ACTIVITY_LOG.

Planner ghi đơn thực sự đã đặt/hủy phần còn lại; Staff nhận từng phần. Duyệt đề xuất không tự đặt hàng hoặc tăng on-order.

## Endpoint theo OpenAPI

- `GET /api/v1/placed-orders` → `listPlacedOrders`
- `POST /api/v1/placed-orders` → `createPlacedOrder`
- `GET /api/v1/placed-orders/{orderId}` → `getPlacedOrder`
- `POST /api/v1/placed-orders/{orderId}/receipts` → `receiveOrder`
- `POST /api/v1/placed-orders/{orderId}/cancellations` → `cancelOrderRemainder`
- `GET /api/v1/placed-orders/{orderId}/history` → `listOrderHistory`
