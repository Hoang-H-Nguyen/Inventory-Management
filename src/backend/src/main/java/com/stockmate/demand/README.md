# Lịch sử bán và phân tích nhu cầu

Nguồn: US03, US04; C3 trong [C4 architecture](../../../../../../../../docs/c4_architecture/C4_ARCHITECTURE.md).

- `api/`: nhận HTTP, validate và ánh xạ lỗi; hiện là stub 501.
- `application/`: interface use case; cần bổ sung actor/session từ backend trước khi hiện thực.
- `domain/`: entity/value object và invariant cần triển khai.
- `infrastructure/`: vị trí repository JPA, query adapter hoặc Gemini adapter cần triển khai.

Dữ liệu: DAILY_SALES.

Dùng 30 ngày lịch đã hoàn tất theo Asia/Saigon; chia tổng bán cho 30. Phân biệt thiếu dữ liệu với ngày đã xác nhận bán 0.

## Endpoint theo OpenAPI

- `GET /api/v1/products/{productId}/sales` → `listSales`
- `GET /api/v1/products/{productId}/demand` → `getDemand`
