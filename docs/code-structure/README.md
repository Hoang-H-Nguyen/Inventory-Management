# StockMate — Cấu trúc mã nguồn

Tài liệu này mô tả cấu trúc thư mục, các file code và trách nhiệm của từng phần trong
StockMate. Mã nguồn khung nằm trong [`src/`](../../src/README.md).

## 1. Tài liệu làm căn cứ

- [Yêu cầu và user stories](../../README.md): phạm vi US01–US14, một kho và bốn vai trò.
- [C4 Architecture](../c4_architecture/C4_ARCHITECTURE.md): React/JavaScript/Vite,
  Java/Spring Boot dạng modular monolith, PostgreSQL và Gemini API phía backend.
- [Business Rules](../requirements/BUSINESS_RULES.md): tồn kho, nhu cầu, ngân sách,
  trạng thái đề xuất và quyền người dùng.
- [Database Design](../database/DATABASE_DESIGN.md): bảng, quan hệ và dữ liệu lịch sử.
- [OpenAPI](../openapi/README.md): endpoint, request/response và quyền truy cập.
- [Information Architecture](../information_architecture/INFORMATION_ARCHITECTURE.md)
  và [UI/UX Walkthrough](../ui_ux/UI_UX_WALKTHROUGH.md): màn hình và luồng thao tác.

## 2. Vị trí tài liệu và mã nguồn

```text
Inventory-Management/
├── README.md
├── docs/
│   ├── code-structure/
│   │   └── README.md                 # Tài liệu cấu trúc mã nguồn này
│   ├── c4_architecture/
│   ├── database/
│   ├── information_architecture/
│   ├── mind_map/
│   ├── openapi/
│   ├── requirements/
│   └── ui_ux/
└── src/                              # Thư mục code-structure trước đây
    ├── frontend/
    ├── backend/
    ├── database/
    ├── contracts/
    └── scripts/
```

Frontend gọi backend qua REST/JSON tại `/api/v1`. Backend truy cập PostgreSQL và
Gemini; frontend không kết nối trực tiếp đến hai dịch vụ này. Prototype trong
`docs/ui_ux/prototype/` là bản minh họa độc lập với mã nguồn khung trong `src/`.

## 3. Cây thư mục và file hiện có

Các cây dưới đây được tách riêng cho frontend, backend và cấu hình dùng chung.
Các thư mục dependency và kết quả build (`node_modules/`, `dist/`, `target/`) cùng
file môi trường riêng được lược bỏ.

### 3.1. Frontend — React / JavaScript / Vite

```text
src/frontend/
├── src/
│   ├── app/
│   │   ├── App.jsx
│   │   └── routes.jsx
│   ├── features/
│   │   ├── ai/
│   │   │   ├── AiDraftPage.jsx
│   │   │   └── api.js
│   │   ├── auth/
│   │   │   ├── AuthPage.jsx
│   │   │   └── api.js
│   │   ├── backorders/
│   │   │   ├── BackorderPage.jsx
│   │   │   └── api.js
│   │   ├── catalog/
│   │   │   ├── CatalogPage.jsx
│   │   │   └── api.js
│   │   ├── dashboard/
│   │   │   ├── DashboardPage.jsx
│   │   │   └── api.js
│   │   ├── demand/
│   │   │   ├── DemandPage.jsx
│   │   │   └── api.js
│   │   ├── inventory/
│   │   │   ├── InventoryPage.jsx
│   │   │   └── api.js
│   │   ├── orders/
│   │   │   ├── PlacedOrderPage.jsx
│   │   │   └── api.js
│   │   ├── proposals/
│   │   │   ├── ProposalPage.jsx
│   │   │   └── api.js
│   │   ├── replenishment/
│   │   │   ├── ReplenishmentPage.jsx
│   │   │   └── api.js
│   │   └── users/
│   │       ├── UserPage.jsx
│   │       └── api.js
│   ├── shared/
│   │   ├── api/
│   │   │   └── http.js
│   │   └── components/
│   │       └── FeaturePlaceholder.jsx
│   ├── styles/
│   │   └── global.css
│   └── main.jsx
├── .env.example
├── index.html
├── package-lock.json
├── package.json
└── vite.config.js
```

### 3.2. Backend — Java / Spring Boot

Các nhánh chỉ có một phần tử được viết gọn trên cùng dòng, ví dụ
`api/AuthController.java`. Đường dẫn thực tế của các file không thay đổi.

```text
src/backend/
├── src/main/
│   ├── java/com/stockmate/
│   │   ├── ai/
│   │   │   ├── api/AiDraftController.java
│   │   │   ├── application/AiDraftService.java
│   │   │   ├── domain/package-info.java
│   │   │   ├── infrastructure/
│   │   │   │   ├── GeminiClient.java
│   │   │   │   └── package-info.java
│   │   │   └── README.md
│   │   ├── audit/
│   │   │   ├── application/AuditService.java
│   │   │   ├── domain/package-info.java
│   │   │   ├── infrastructure/package-info.java
│   │   │   └── README.md
│   │   ├── auth/
│   │   │   ├── api/AuthController.java
│   │   │   ├── application/AuthService.java
│   │   │   ├── domain/
│   │   │   │   ├── Role.java
│   │   │   │   └── package-info.java
│   │   │   ├── infrastructure/package-info.java
│   │   │   └── README.md
│   │   ├── backorders/
│   │   │   ├── api/BackorderController.java
│   │   │   ├── application/BackorderService.java
│   │   │   ├── domain/package-info.java
│   │   │   ├── infrastructure/package-info.java
│   │   │   └── README.md
│   │   ├── catalog/
│   │   │   ├── api/CatalogController.java
│   │   │   ├── application/CatalogService.java
│   │   │   ├── domain/package-info.java
│   │   │   ├── infrastructure/package-info.java
│   │   │   └── README.md
│   │   ├── config/
│   │   │   ├── BusinessTimeConfig.java
│   │   │   └── SecurityConfig.java
│   │   ├── dashboard/
│   │   │   ├── api/DashboardController.java
│   │   │   ├── application/DashboardService.java
│   │   │   ├── domain/package-info.java
│   │   │   ├── infrastructure/package-info.java
│   │   │   └── README.md
│   │   ├── demand/
│   │   │   ├── api/DemandController.java
│   │   │   ├── application/DemandService.java
│   │   │   ├── domain/package-info.java
│   │   │   ├── infrastructure/package-info.java
│   │   │   └── README.md
│   │   ├── inventory/
│   │   │   ├── api/InventoryController.java
│   │   │   ├── application/InventoryService.java
│   │   │   ├── domain/
│   │   │   │   ├── MovementType.java
│   │   │   │   └── package-info.java
│   │   │   ├── infrastructure/package-info.java
│   │   │   └── README.md
│   │   ├── orders/
│   │   │   ├── api/PlacedOrderController.java
│   │   │   ├── application/PlacedOrderService.java
│   │   │   ├── domain/package-info.java
│   │   │   ├── infrastructure/package-info.java
│   │   │   └── README.md
│   │   ├── proposals/
│   │   │   ├── api/ProposalController.java
│   │   │   ├── application/ProposalService.java
│   │   │   ├── domain/
│   │   │   │   ├── ProposalStatus.java
│   │   │   │   └── package-info.java
│   │   │   ├── infrastructure/package-info.java
│   │   │   └── README.md
│   │   ├── replenishment/
│   │   │   ├── api/ReplenishmentController.java
│   │   │   ├── application/ReplenishmentService.java
│   │   │   ├── domain/package-info.java
│   │   │   ├── infrastructure/
│   │   │   │   ├── ReplenishmentScheduler.java
│   │   │   │   └── package-info.java
│   │   │   └── README.md
│   │   ├── shared/
│   │   │   ├── api/
│   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   └── NotImplementedException.java
│   │   │   └── contract/    # 65 DTO — danh sách riêng bên dưới
│   │   ├── users/
│   │   │   ├── api/UserController.java
│   │   │   ├── application/UserService.java
│   │   │   ├── domain/package-info.java
│   │   │   ├── infrastructure/package-info.java
│   │   │   └── README.md
│   │   └── StockMateApplication.java
│   └── resources/
│       ├── db/migration/README.md
│       └── application.yml
└── pom.xml
```

<details>
<summary>Danh sách 65 file DTO của backend trong shared/contract/</summary>

```text
src/backend/src/main/java/com/stockmate/shared/contract/
├── AIInput.java
├── AIResult.java
├── ApiError.java
├── AuditEvent.java
├── AuditEventList.java
├── AuthSession.java
├── Backorder.java
├── BackorderInput.java
├── BackorderList.java
├── BackorderMutation.java
├── Calculation.java
├── CancelInput.java
├── ChangePasswordInput.java
├── Dashboard.java
├── Demand.java
├── DraftInput.java
├── DraftItemInput.java
├── DraftUpdate.java
├── Inventory.java
├── InventoryList.java
├── LineCalculation.java
├── LoginInput.java
├── LowStock.java
├── LowStockList.java
├── Message.java
├── MovementResult.java
├── OrderInput.java
├── OrderMutation.java
├── Pagination.java
├── PartialInput.java
├── PlacedOrder.java
├── PlacedOrderList.java
├── Policy.java
├── PolicyInput.java
├── Product.java
├── ProductInput.java
├── ProductList.java
├── ProductUpdate.java
├── Proposal.java
├── ProposalItem.java
├── ProposalList.java
├── RejectInput.java
├── ResetPasswordInput.java
├── ReviewInput.java
├── Run.java
├── RunList.java
├── SaleInput.java
├── SalesDay.java
├── SalesDayList.java
├── StockCountInput.java
├── StockMovement.java
├── StockMovementList.java
├── SubmitInput.java
├── Supplier.java
├── SupplierInput.java
├── SupplierList.java
├── SupplierProduct.java
├── SupplierProductInput.java
├── SupplierProductList.java
├── SupplierProductUpdate.java
├── SupplierUpdate.java
├── User.java
├── UserCreateInput.java
├── UserList.java
└── UserUpdateInput.java
```

</details>

### 3.3. Cấu hình và công cụ dùng chung

```text
src/
├── README.md
├── .gitignore
├── .env.example
├── compose.yaml
├── contracts/
│   ├── README.md
│   └── api-map.json
├── database/
│   └── README.md
└── scripts/
    └── generate-contracts.py
```

## 4. Trách nhiệm các file frontend

- `package.json` khai báo dependency và lệnh chạy; `package-lock.json` khóa phiên bản.
- `vite.config.js` cấu hình React plugin và proxy `/api` về backend khi phát triển.
- `index.html` là trang gốc; `src/main.jsx` khởi tạo React và BrowserRouter.
- `app/App.jsx` tổ chức layout; `app/routes.jsx` khai báo route cho từng module.
- `features/<module>/*Page.jsx` là điểm vào màn hình của module.
- `features/<module>/api.js` gom các hàm gọi API theo `operationId` trong OpenAPI.
- `shared/api/http.js` dùng chung cho fetch, bearer token, query và lỗi API.
- `shared/components/FeaturePlaceholder.jsx` hiển thị nội dung tạm của màn hình khung.
- `styles/global.css` chứa style dùng chung; `.env.example` mô tả API base URL.

Khi triển khai, bổ sung form, danh sách và màn hình chi tiết trong module tương ứng,
ví dụ `LoginForm.jsx`, `UserForm.jsx`, `ReceiptForm.jsx`, `StockCountForm.jsx`,
`ProposalEditor.jsx`, `ProposalDetail.jsx` và `AiDraftPanel.jsx`. Đây là các tên file
dự kiến, chưa có trong cây hiện tại. Cần bổ sung session provider và route guard;
phân quyền thực tế luôn được kiểm tra lại ở backend.

## 5. Trách nhiệm các file backend

- `pom.xml` khai báo dependency và build Maven; `StockMateApplication.java` khởi động Spring Boot.
- `config/SecurityConfig.java` cấu hình bảo vệ HTTP. Khi triển khai auth, bổ sung
  kiểm tra opaque session, trạng thái tài khoản, đổi mật khẩu bắt buộc, role và ownership.
- `config/BusinessTimeConfig.java` cung cấp thời gian nghiệp vụ theo `Asia/Saigon`.
- `shared/api/GlobalExceptionHandler.java` ánh xạ exception thành response lỗi.
- `shared/api/NotImplementedException.java` đánh dấu các handler chưa triển khai.
- `shared/contract/*.java` là 65 transport DTO sinh từ OpenAPI; không phải entity JPA.
  `ApiError.java` tương ứng schema `Error` trong hợp đồng API.
- `<module>/api/*Controller.java` nhận request và trả response theo OpenAPI.
- `<module>/application/*Service.java` là interface các use case cần hiện thực.
- `<module>/domain/package-info.java` ghi vị trí model và quy tắc nghiệp vụ cần bổ sung.
- `<module>/infrastructure/package-info.java` ghi vị trí repository hoặc provider adapter.
- `<module>/README.md` liên kết module với user story, dữ liệu và endpoint liên quan.
- `resources/application.yml` chứa cấu hình datasource, Jackson, múi giờ và cấu hình
  dự kiến cho AI/scheduler; `resources/db/migration/` là vị trí SQL Flyway.

Mỗi module được tổ chức theo các lớp `api → application → domain`, với adapter trong
`infrastructure`. Các package chạy trong cùng một backend. Khi hiện thực, thêm
`*ServiceImpl.java`, model, repository và adapter vào module tương ứng; giữ DTO HTTP
tách khỏi model lưu trữ.

## 6. Các module nghiệp vụ

- **`auth` — US13:** đăng nhập, `/me`, logout, đổi mật khẩu, opaque token và thu hồi phiên.
  `domain/Role.java` định nghĩa bốn vai trò của hệ thống.
- **`users` — US14:** quản trị tài khoản, mật khẩu tạm, role và trạng thái khóa;
  bảo vệ Admin cuối cùng và lưu lịch sử quản trị.
- **`catalog` — US11:** sản phẩm, nhà cung cấp, giá và chính sách tồn kho.
- **`inventory` — US01–US02:** tồn kho, bán hàng, kiểm kê và lịch sử biến động.
  `domain/MovementType.java` định nghĩa receipt, sale và adjustment.
- **`orders` — US12/US02:** đơn mua thực sự đã đặt, nhận từng phần và hủy phần còn lại.
  Receipt thuộc API đơn mua dù đồng thời làm thay đổi tồn kho.
- **`backorders` — US12/US02:** hàng nợ khách, giao từng phần và hủy phần chưa giao;
  một lần giao ghi đúng một sale.
- **`demand` — US03–US04:** lịch sử bán và nhu cầu của 30 ngày lịch hoàn tất;
  phân biệt thiếu dữ liệu với ngày đã xác nhận bán 0.
- **`replenishment` — US05:** Inventory Position, ROP, lượng gợi ý và các đợt kiểm tra.
  `ReplenishmentScheduler.java` là vị trí job hằng ngày dùng chung service với manual check.
- **`proposals` — US06–US09:** draft, budget, snapshot, submit, approve/reject và copy.
  `domain/ProposalStatus.java` định nghĩa DRAFT/PENDING/APPROVED/REJECTED.
  Duyệt đề xuất không tự đặt hàng hoặc thay đổi tồn kho.
- **`ai` — US06:** hỗ trợ tạo/sửa draft qua các service đã kiểm quyền.
  `GeminiClient.java` là interface kết nối provider; AI không submit hoặc approve.
- **`dashboard` — US10:** tổng hợp SKU active, cảnh báo, dữ liệu thiếu và đề xuất Pending cho Manager.
- **`audit`:** ghi actor/target, thời gian, lý do và snapshot lịch sử trong transaction
  nghiệp vụ. Đây là thành phần nội bộ; endpoint lịch sử thuộc module quản lý bản ghi.

## 7. Database, hợp đồng API và cấu hình

- `src/database/README.md` ghi kế hoạch bảng và migration dựa trên thiết kế database.
  Các model dự kiến gồm tài khoản/phiên, sản phẩm/nhà cung cấp/giá/chính sách, tồn kho,
  daily sales, placed orders, backorders, movements, proposals/items và activity log.
- `src/backend/src/main/resources/db/migration/` hiện có README; cần bổ sung
  `V1__initial_schema.sql` khi triển khai schema.
- `src/contracts/api-map.json` ánh xạ 57 operation sang module và role; OpenAPI chuẩn
  vẫn nằm ở `docs/openapi/`.
- `src/scripts/generate-contracts.py` sinh DTO và api-map từ OpenAPI. Chạy từ root:

  ```bash
  python3 src/scripts/generate-contracts.py
  ```

- `src/compose.yaml` khai báo PostgreSQL local; `src/.env.example` mô tả biến môi trường
  backend/database. Gemini API key thuộc backend.

Sau khi thay đổi hợp đồng API, đồng bộ controller, service và `features/*/api.js`
cùng DTO được sinh lại.

## 8. Trạng thái triển khai

Hiện có cấu trúc module, chữ ký controller/service, DTO và hàm gọi API. Controller
là stub; trang React là placeholder. Auth thực tế, form nghiệp vụ, service implementation,
entity/repository, SQL migration/seed, tính toán demand/budget, daily job và kết nối
Gemini còn cần triển khai.

Hướng dẫn chạy nằm tại [`src/README.md`](../../src/README.md). Khi thêm hoặc đổi vị trí
file, cập nhật tài liệu cấu trúc này cùng mã nguồn.
