# StockMate — Khung mã nguồn

Thư mục này bổ sung cấu trúc và file khung dựa trên tài liệu hiện có của dự án.
Đây là điểm bắt đầu để phát triển US01–US14; chưa phải hệ thống nghiệp vụ hoàn chỉnh.

Xem [tài liệu cấu trúc mã nguồn](../docs/code-structure/README.md) để tra cứu cây thư mục
và trách nhiệm từng nhóm file.

## Tài liệu làm căn cứ

- [Yêu cầu và user stories](../README.md), [Business Rules](../docs/requirements/BUSINESS_RULES.md).
- [C4 Architecture](../docs/c4_architecture/C4_ARCHITECTURE.md): React/JavaScript/Vite,
  backend Java/Spring Boot dạng modular monolith, PostgreSQL, Gemini ở backend.
- [Database Design](../docs/database/DATABASE_DESIGN.md), [OpenAPI](../docs/openapi/README.md).
- [Information Architecture](../docs/information_architecture/INFORMATION_ARCHITECTURE.md),
  [UI/UX Walkthrough](../docs/ui_ux/UI_UX_WALKTHROUGH.md).

## Cấu trúc

```text
src/
├── README.md
├── .env.example
├── .gitignore
├── compose.yaml                    # PostgreSQL local
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── .env.example
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── app/                    # App.jsx, routes.jsx
│       ├── features/               # Theo từng module: *Page.jsx, api.js
│       │   ├── auth/
│       │   ├── users/
│       │   ├── catalog/
│       │   ├── inventory/
│       │   ├── orders/
│       │   ├── backorders/
│       │   ├── demand/
│       │   ├── replenishment/
│       │   ├── proposals/
│       │   ├── ai/
│       │   └── dashboard/
│       ├── shared/api/http.js
│       ├── shared/components/FeaturePlaceholder.jsx
│       └── styles/global.css
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/stockmate/
│       │   ├── StockMateApplication.java
│       │   ├── config/             # SecurityConfig, BusinessTimeConfig
│       │   ├── shared/
│       │   │   ├── api/            # GlobalExceptionHandler, NotImplementedException
│       │   │   └── contract/       # DTO Java sinh từ OpenAPI
│       │   └── <module>/           # 11 module như frontend + audit nội bộ
│       │       ├── README.md
│       │       ├── api/            # *Controller.java theo OpenAPI (trừ audit)
│       │       ├── application/    # *Service.java: interface use case
│       │       ├── domain/         # Enum + package-info: entity/invariant cần viết
│       │       └── infrastructure/ # package-info: repository/adapter cần viết
│       └── resources/
│           ├── application.yml
│           └── db/migration/README.md
├── database/README.md              # Bảng, thứ tự migration và lưu ý thiết kế
├── contracts/                     # README.md, api-map.json
└── scripts/generate-contracts.py
```

## Đã có và cần làm tiếp

Đã có khung React với route riêng cho từng module; HTTP client và hàm gọi API theo
operationId; Spring Boot entry point/config; controller với chữ ký request/response,
interface service; DTO sinh từ OpenAPI; cấu hình PostgreSQL và vị trí migration.
Các module có README chỉ rõ user story, bảng dữ liệu và quy tắc cần hiện thực.

Chưa có xác thực, form nghiệp vụ, service implementation, entity/repository JPA,
SQL migration/seed, tính toán demand/budget, job hằng ngày hoặc kết nối Gemini.
API helper chưa được nối vào các trang placeholder. Không dùng localStorage của prototype
làm nguồn dữ liệu backend. Prototype cũ tiếp tục nằm ở `docs/ui_ux/prototype/`.

Security hiện chỉ mở `GET /actuator/health` và `POST /api/v1/auth/login`.
Login và các controller là stub ném `NOT_IMPLEMENTED` (HTTP 501); route được bảo vệ
bị chặn trước khi vào controller. Chưa phân biệt đầy đủ lỗi 401/403 theo contract.
Khi xây auth, thay security gate bằng opaque session filter và kiểm tra role,
account status, forced password change, ownership; không chỉ đổi sang permitAll.
Điều hướng frontend hiện chỉ giúp duyệt khung phát triển, chưa phải role guard.

## Chạy frontend

Cần Node.js 22.12+ và npm. Từ root repository:

```bash
cd src/frontend
cp .env.example .env
npm ci
npm run dev
```

Mở `http://localhost:5173`. Vite proxy `/api` tới `http://localhost:8080`.
`npm run build` tạo bản build; production cần cấu hình API/reverse proxy riêng
và fallback `index.html` cho BrowserRouter. Không đặt Gemini key trong biến `VITE_*`.

## Chạy database và backend

Cần Docker Compose, JDK 21 và Maven 3.6.3+; chưa kèm Maven wrapper.
Từ root repository:

```bash
cd src
cp .env.example .env
# Sửa POSTGRES_PASSWORD và SPRING_DATASOURCE_PASSWORD thành cùng một giá trị local.
docker compose up -d database
set -a
source .env
set +a
cd backend
mvn spring-boot:run
```

Compose đọc `.env`; Spring Boot nhận biến môi trường đã export.
Nếu đổi port/database/user, đồng bộ `SPRING_DATASOURCE_*` trong `.env`.
Kiểm tra `http://localhost:8080/actuator/health`. Database chưa có bảng nghiệp vụ;
cần viết migration và entity trước khi triển khai chức năng lưu trữ.
`AI_ENABLED` và `REPLENISHMENT_SCHEDULING_ENABLED` là cấu hình dự kiến;
chưa có adapter/job thực thi kể cả khi đổi chúng sang `true`.

## Thứ tự phát triển đề xuất

1. Migration + model nền, auth/session và quản trị tài khoản; bổ sung phân quyền server.
2. Catalog/policy → inventory → placed orders/backorders; transaction, audit và chống ghi trùng.
3. Sales/demand đủ 30 ngày → low-stock và daily/manual check dùng chung service.
4. Proposal form, tính lại giá/budget, snapshot, submit/decision/copy và ownership.
5. Dashboard, sau đó Gemini draft assistant qua cùng service của form.

Kiểm tra cạnh tranh phiên/Admin cuối cùng, receipt/delivery một phần, ghi sale một lần,
ngày thiếu so với 0, ngưỡng Position = ROP, quá budget và hai Manager xử lý cùng đề xuất.

## Đồng bộ hợp đồng và kiểm tra

```bash
# Từ root repository
python3 src/scripts/generate-contracts.py
node docs/openapi/validate-openapi.mjs
cd src/frontend
npm run build
# Ở src/backend
mvn test
```

Script sinh DTO/api-map; controller/service/frontend API cần được cập nhật cùng đặc tả.
Chưa có test nghiệp vụ vì service chưa triển khai; Maven test chủ yếu kiểm tra biên dịch
ở giai đoạn này. JDK 21, Spring Boot 3.5.16 và PostgreSQL 17 là lựa chọn cho scaffold,
không thay đổi yêu cầu nghiệp vụ hoặc quyết định hosting trong tài liệu.

Tham khảo tương thích: [Spring Boot](https://docs.spring.io/spring-boot/3.5/system-requirements.html),
[Vite](https://vite.dev/guide/), [React](https://react.dev/versions).
