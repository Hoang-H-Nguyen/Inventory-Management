# Hàng còn nợ khách

Nguồn: US12, US02; C3 trong [C4 architecture](../../../../../../../../docs/c4_architecture/C4_ARCHITECTURE.md).

- `api/`: nhận HTTP, validate và ánh xạ lỗi; hiện là stub 501.
- `application/`: interface use case; cần bổ sung actor/session từ backend trước khi hiện thực.
- `domain/`: entity/value object và invariant cần triển khai.
- `infrastructure/`: vị trí repository JPA, query adapter hoặc Gemini adapter cần triển khai.

Dữ liệu: CUSTOMER_BACKORDERS, INVENTORY, DAILY_SALES, STOCK_MOVEMENTS, ACTIVITY_LOG.

Planner tạo/hủy phần chưa giao; Staff giao từng phần. Giao giảm stock và nợ khách, ghi đúng một sale; hủy không đổi stock.

## Endpoint theo OpenAPI

- `GET /api/v1/backorders` → `listBackorders`
- `POST /api/v1/backorders` → `createBackorder`
- `GET /api/v1/backorders/{backorderId}` → `getBackorder`
- `POST /api/v1/backorders/{backorderId}/fulfilments` → `fulfilBackorder`
- `POST /api/v1/backorders/{backorderId}/cancellations` → `cancelBackorder`
- `GET /api/v1/backorders/{backorderId}/history` → `listBackorderHistory`
