# Đăng nhập và phiên làm việc

Nguồn: US13; C3 trong [C4 architecture](../../../../../../../../docs/c4_architecture/C4_ARCHITECTURE.md).

- `api/`: nhận HTTP, validate và ánh xạ lỗi; hiện là stub 501.
- `application/`: interface use case; cần bổ sung actor/session từ backend trước khi hiện thực.
- `domain/`: entity/value object và invariant cần triển khai.
- `infrastructure/`: vị trí repository JPA, query adapter hoặc Gemini adapter cần triển khai.

Dữ liệu: USERS, AUTH_SESSIONS.

Chuẩn hóa username; băm mật khẩu và token; phiên tối đa 8 giờ; đổi mật khẩu tạm; thu hồi phiên. Không dùng JWT thay cho opaque token đã đặc tả.

## Endpoint theo OpenAPI

- `GET /api/v1/me` → `getMe`
- `POST /api/v1/auth/login` → `login`
- `POST /api/v1/auth/logout` → `logout`
- `POST /api/v1/auth/change-password` → `changePassword`
