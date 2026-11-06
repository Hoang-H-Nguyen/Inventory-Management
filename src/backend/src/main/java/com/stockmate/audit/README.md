# Lịch sử hoạt động

Nguồn: US02, US07, US12, US14; C3 trong [C4 architecture](../../../../../../../../docs/c4_architecture/C4_ARCHITECTURE.md).

- `api/`: nhận HTTP, validate và ánh xạ lỗi; hiện là stub 501.
- `application/`: interface use case; cần bổ sung actor/session từ backend trước khi hiện thực.
- `domain/`: entity/value object và invariant cần triển khai.
- `infrastructure/`: vị trí repository JPA, query adapter hoặc Gemini adapter cần triển khai.

Dữ liệu: ACTIVITY_LOG.

Audit ghi cùng transaction nghiệp vụ; lưu actor/target và tên lịch sử, timestamp, reason, snapshot. Không ghi mật khẩu, token hoặc credential hash.

## Endpoint theo OpenAPI

- Nội bộ; không có HTTP endpoint riêng. Account history đi qua users; các history khác qua module tương ứng.
