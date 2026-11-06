# Trợ lý soạn đề xuất

Nguồn: US06; C3 trong [C4 architecture](../../../../../../../../docs/c4_architecture/C4_ARCHITECTURE.md).

- `api/`: nhận HTTP, validate và ánh xạ lỗi; hiện là stub 501.
- `application/`: interface use case; cần bổ sung actor/session từ backend trước khi hiện thực.
- `domain/`: entity/value object và invariant cần triển khai.
- `infrastructure/`: vị trí repository JPA, query adapter hoặc Gemini adapter cần triển khai.

Dữ liệu: Không truy cập DB trực tiếp; gọi service demand/catalog/proposals.

Gemini chỉ tạo/sửa Draft qua service có kiểm quyền và kiểm ownership. Không submit/approve/ghi stock/đặt hàng; không tự giảm số lượng để vừa budget. Form vẫn dùng được khi AI lỗi.

## Endpoint theo OpenAPI

- `POST /api/v1/ai/draft-requests` → `createAIDraftRequest`
- `GET /api/v1/ai/draft-requests/{requestId}` → `getAIRequest`
