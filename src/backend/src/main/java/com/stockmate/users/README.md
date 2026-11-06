# Quản trị tài khoản

Nguồn: US14; C3 trong [C4 architecture](../../../../../../../../docs/c4_architecture/C4_ARCHITECTURE.md).

- `api/`: nhận HTTP, validate và ánh xạ lỗi; hiện là stub 501.
- `application/`: interface use case; cần bổ sung actor/session từ backend trước khi hiện thực.
- `domain/`: entity/value object và invariant cần triển khai.
- `infrastructure/`: vị trí repository JPA, query adapter hoặc Gemini adapter cần triển khai.

Dữ liệu: USERS, AUTH_SESSIONS, ACTIVITY_LOG.

Admin không có quyền nghiệp vụ. Không xóa cứng; chặn tự khóa/tự hạ quyền và mất Admin cuối cùng; vô hiệu phiên khi đổi role/status/password.

## Endpoint theo OpenAPI

- `GET /api/v1/users` → `listUsers`
- `POST /api/v1/users` → `createUser`
- `GET /api/v1/users/{userId}` → `getUser`
- `PATCH /api/v1/users/{userId}` → `updateUser`
- `POST /api/v1/users/{userId}/reset-password` → `resetUserPassword`
- `GET /api/v1/user-activity` → `listUserActivity`
