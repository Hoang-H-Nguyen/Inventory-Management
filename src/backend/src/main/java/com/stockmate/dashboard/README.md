# Tổng quan cho Manager

Nguồn: US10; C3 trong [C4 architecture](../../../../../../../../docs/c4_architecture/C4_ARCHITECTURE.md).

- `api/`: nhận HTTP, validate và ánh xạ lỗi; hiện là stub 501.
- `application/`: interface use case; cần bổ sung actor/session từ backend trước khi hiện thực.
- `domain/`: entity/value object và invariant cần triển khai.
- `infrastructure/`: vị trí repository JPA, query adapter hoặc Gemini adapter cần triển khai.

Dữ liệu: Truy vấn catalog, replenishment và proposals.

Chỉ Manager. Đếm SKU active, cần bổ sung, thiếu dữ liệu và Pending; không suy diễn thiếu dữ liệu thành đủ hàng.

## Endpoint theo OpenAPI

- `GET /api/v1/dashboard` → `getDashboard`
