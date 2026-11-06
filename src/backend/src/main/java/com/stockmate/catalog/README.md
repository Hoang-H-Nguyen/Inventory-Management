# Sản phẩm, nhà cung cấp và chính sách

Nguồn: US11; C3 trong [C4 architecture](../../../../../../../../docs/c4_architecture/C4_ARCHITECTURE.md).

- `api/`: nhận HTTP, validate và ánh xạ lỗi; hiện là stub 501.
- `application/`: interface use case; cần bổ sung actor/session từ backend trước khi hiện thực.
- `domain/`: entity/value object và invariant cần triển khai.
- `infrastructure/`: vị trí repository JPA, query adapter hoặc Gemini adapter cần triển khai.

Dữ liệu: PRODUCTS, SUPPLIERS, SUPPLIER_PRODUCTS, REPLENISHMENT_POLICIES.

Planner quản lý; Staff chỉ đọc thông tin sản phẩm. Tạo sản phẩm cùng tồn kho; bảo toàn snapshot đề xuất đã gửi.

## Endpoint theo OpenAPI

- `GET /api/v1/products` → `listProducts`
- `POST /api/v1/products` → `createProduct`
- `GET /api/v1/products/{productId}` → `getProduct`
- `PATCH /api/v1/products/{productId}` → `updateProduct`
- `GET /api/v1/suppliers` → `listSuppliers`
- `POST /api/v1/suppliers` → `createSupplier`
- `PATCH /api/v1/suppliers/{supplierId}` → `updateSupplier`
- `GET /api/v1/products/{productId}/suppliers` → `listSupplierProducts`
- `POST /api/v1/products/{productId}/suppliers` → `createSupplierProduct`
- `PATCH /api/v1/supplier-products/{supplierProductId}` → `updateSupplierProduct`
- `PUT /api/v1/products/{productId}/policy` → `setPolicy`
