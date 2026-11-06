# PostgreSQL — kế hoạch triển khai

Nguồn: [Database Design](../../docs/database/DATABASE_DESIGN.md) và
[OpenAPI](../../docs/openapi/openapi.json). Chưa có schema/migration hoặc seed nghiệp vụ.
`compose.yaml` chỉ khởi tạo PostgreSQL; không tự tạo tài khoản Admin.

Các bảng dự kiến theo thứ tự phụ thuộc:

1. `users`, `auth_sessions` — tài khoản và token băm, expiry/revocation/auth_version.
2. `products`, `suppliers`, `supplier_products`, `replenishment_policies`.
3. `inventory`, `daily_sales` — unique product/date; cần thể hiện ngày bán đã hoàn tất.
4. `replenishment_proposals`, `replenishment_proposal_items` — ngân sách VND, version, snapshot.
5. `placed_orders`, `customer_backorders` — lượng đặt/nhận/giao/hủy, reference và version.
6. `stock_movements`, `activity_log` — actor, lý do, snapshot tên lịch sử, timestamp.

Đặt SQL ở `backend/src/main/resources/db/migration/V1__initial_schema.sql`.
Thêm FK, CHECK quantity/remaining, unique username/SKU/product-supplier/reference và index
theo tài liệu. On-order/backorders là tổng lượng còn lại, không phải số nhập tay.

Database Design là thiết kế logic. Khi viết migration cần đối chiếu thêm các field kỹ thuật
trong OpenAPI như `version`, `is_complete`, `is_active`, snapshot và idempotency;
cách lưu run metadata/retry là quyết định triển khai, không phải module kinh doanh mới.
Không biến bản DTO API thành entity JPA trực tiếp.

Chỉ seed dữ liệu demo trong môi trường dev. Tài khoản Admin ban đầu cần quy trình bootstrap
sử dụng password hash và bắt buộc đổi mật khẩu; không commit mật khẩu hoặc token thật.
