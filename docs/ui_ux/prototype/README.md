# StockMate — Web UI prototype

Prototype StockMate sử dụng HTML/CSS/JavaScript thuần cho US01–US14, với bố cục desktop, sidebar điều hướng theo vai trò và tông xanh.

## Mở prototype

Cách nhanh nhất: mở [index.html](./index.html) bằng Edge, Chrome hoặc Firefox. Không cần cài thư viện, build hay internet; không tải font hoặc tài nguyên bên ngoài. Dùng cùng một trình duyệt/đường dẫn để giữ dữ liệu mẫu. Nếu trình duyệt chặn localStorage với file cục bộ, dùng HTTP server bên dưới.

Nếu có Node.js, chạy từ thư mục repo:

```sh
node docs/ui_ux/prototype/serve.mjs
```

Mở **http://127.0.0.1:4173**. Có thể đặt biến môi trường `PORT` nếu cổng đang được dùng. Server chỉ lắng nghe trên máy cục bộ. Dừng bằng Ctrl+C.

## Tài khoản và đăng nhập

Mở prototype sẽ hiển thị màn đăng nhập với các ô nhập trống. Giao diện và ảnh UI/UX không hiển thị tài khoản mẫu, mật khẩu hoặc nút điền sẵn. Các tài khoản dưới đây chỉ dành cho kiểm tra kỹ thuật, nhập thủ công khi cần thử luồng. Bốn tài khoản mẫu dùng chung mật khẩu **StockMate123!**:

| Username | Vai trò | Trang sau đăng nhập |
|---|---|---|
| admin | Admin | Quản trị tài khoản |
| staff | Nhân viên kho | Tồn kho |
| planner | Inventory Planner | Tồn kho |
| manager | Quản lý | Tổng quan |

Đăng xuất rồi đăng nhập tài khoản khác để thử vai trò. Tham số URL không thay đổi quyền của phiên. Admin không có quyền nghiệp vụ kho/đề xuất.

Admin tạo/sửa tài khoản, lọc theo vai trò/trạng thái, khóa/mở khóa và cấp mật khẩu tạm. Username duy nhất, không sửa sau khi tạo; không xóa cứng tài khoản. Tài khoản tạo/cấp lại mật khẩu phải đổi mật khẩu ở lần đăng nhập tiếp. Không có đăng ký công khai hay gửi email khôi phục. Admin không được tự khóa/tự bỏ quyền; phải còn ít nhất một Admin hoạt động.

Mật khẩu dài 8–128 ký tự. Đổi mật khẩu cần mật khẩu hiện tại, xác nhận và mật khẩu mới khác mật khẩu cũ. Phiên nằm trong sessionStorage theo tab; tài khoản và verifier mật khẩu nằm trong localStorage. Khóa/đổi vai trò/cấp lại mật khẩu thu hồi các phiên trước qua auth_version. Đổi mật khẩu tạo phiên thay thế cho tab đang dùng.

**Đặt lại mẫu** xác nhận trước khi khôi phục dữ liệu nghiệp vụ, giữ tài khoản/mật khẩu. Để khôi phục cả bốn tài khoản mặc định, xóa dữ liệu trang bằng Developer Tools rồi tải lại (sẽ mất thay đổi cục bộ). Không dùng thông tin thật.

## Cấu trúc

```text
prototype/
├── index.html          Điểm vào
├── styles.css          Bố cục, màu, responsive
├── app.js              Dữ liệu mẫu, tính toán và tương tác
├── auth.js             Tài khoản, verifier mật khẩu và phiên demo
├── account-views.js    Màn đăng nhập, đổi mật khẩu và Admin
├── serve.mjs           HTTP server Node.js tùy chọn, không dependency
├── verify.mjs          Kiểm tra luồng bằng Playwright và chụp ảnh
├── verification.json   Kết quả kiểm tra lần gần nhất
└── screenshots/        PNG chụp từ prototype + manifest.json
```

[UI/UX Walkthrough](../UI_UX_WALKTHROUGH.md) sử dụng 10 ảnh giao diện tiêu biểu trong `screenshots/`.

## Luồng có thể thử

- Tài khoản: đăng nhập/đăng xuất, đổi mật khẩu, kiểm tra tài khoản khóa và quyền truy cập.
- Admin: tìm/lọc, tạo/sửa, khóa/mở khóa, cấp mật khẩu tạm và xem hoạt động tài khoản.

- Staff: tìm kiếm; chi tiết sản phẩm; nhận hàng theo đơn; bán trực tiếp/giao backorder; kiểm kê; kiểm tra số lượng, lý do và lịch sử.
- Planner: phân tích nhu cầu 30 ngày; lọc lịch sử; kiểm tra cảnh báo; lập đề xuất nhiều dòng/nhà cung cấp; thêm/xóa sản phẩm; sửa số lượng, giá theo NCC và ngân sách; lưu/gửi bản nháp.
- AI mẫu: giải thích phép tính; đề nghị số lượng và áp dụng vào bản nháp; mô phỏng lỗi để tiếp tục bằng form. Không gọi mô hình AI thật.
- Manager: dashboard; danh sách/chi tiết đề xuất; duyệt hoặc từ chối kèm lý do; không quyết định lại.
- Planner: sao chép đề xuất bị từ chối thành bản nháp mới; quản lý sản phẩm, NCC, giá, chính sách; ghi nhận đơn thực tế/backorder; hủy phần chưa hoàn tất.

## Dữ liệu và giới hạn

- Một kho, tiền VND, số lượng nguyên theo đơn vị của mỗi SKU. Có 5 SKU mẫu.
- Ngày nghiệp vụ cố định **02/11/2026** để ảnh và ví dụ tái lập được. Nhu cầu dùng **03/10–01/11/2026** (30 ngày đã hoàn tất); bộ lọc lịch sử không thay đổi cửa sổ tính này. Giao dịch mới có ngày 02/11/2026; dấu thời gian thao tác dùng thời gian thực theo Asia/Ho_Chi_Minh. Đây là đồng hồ demo, không phải lịch tự cập nhật.
- Lịch sử bán mẫu ghi tổng bán từng ngày. Trạng thái đủ/thiếu dữ liệu được gắn trong fixture; sản phẩm thêm mới mặc định thiếu dữ liệu. Không có màn xác nhận hoàn thiện dữ liệu bán nhập khẩu.
- Phép tính chạy bằng JavaScript cục bộ để minh họa quy tắc. Ứng dụng thật cần backend làm nguồn tính toán/kiểm tra quyền. Tài khoản dùng verifier PBKDF2 với salt, nhưng toàn bộ kiểm tra vẫn chạy ở client nên không cung cấp bảo mật xác thực thực tế. Backend triển khai phải băm mật khẩu bằng cơ chế phù hợp và kiểm tra mọi yêu cầu.
- localStorage chỉ lưu trên một trình duyệt/origin; có thể thử tài khoản khác nhau trên các tab với sessionStorage riêng, nhưng không có đồng bộ giữa thiết bị, khóa đồng thời hoặc cơ sở dữ liệu. Nếu lưu trữ bị chặn thì dùng chế độ trình duyệt cho phép localStorage.
- Chưa kết nối API; phiên demo tồn tại theo vòng đời tab, chưa áp dụng thời hạn token 8 giờ được đặc tả cho backend. Không tự đặt hàng, không gửi email, không thanh toán. Kiểm tra cảnh báo theo yêu cầu hoạt động; lịch kiểm tra hằng ngày cần backend.
- Giá/tên/đơn vị trong đề xuất là snapshot; sao chép bản bị từ chối lấy lại thông tin hiện tại. Không tự thay số lượng đã chọn hoặc tự giảm số lượng khi vượt ngân sách.

## Kiểm tra và chụp lại màn hình

Cần Node.js và Playwright, Edge đã cài. Nếu máy chưa có Playwright, có thể cài riêng công cụ kiểm tra bằng `npm install --no-save playwright` trong thư mục prototype. Bản thân UI không cần dependency này.

Giữ server chạy ở terminal thứ nhất, terminal thứ hai chạy:

```sh
node docs/ui_ux/prototype/verify.mjs --capture
```

Không có `--capture` thì chỉ kiểm tra luồng. Script tạo một browser context riêng, đặt lại fixture giữa các ảnh; không sửa dữ liệu demo trong trình duyệt đang dùng của bạn. Kết quả ghi vào `verification.json`; ảnh và thông tin vai trò/route ghi vào `screenshots/manifest.json`.

Biến môi trường tùy chọn: `PLAYWRIGHT_MODULE` (đường dẫn module đã cài), `BROWSER_PATH` (executable Chromium khác), `PROTOTYPE_URL` (mặc định `http://127.0.0.1:4173`). Chỉ chụp 10 màn desktop tiêu biểu ở viewport 1440×1000, toàn trang; mobile 390×844 được kiểm tra bố cục mà không chụp thêm ảnh. Một số trang dài có ảnh cao hơn viewport.

Nguồn yêu cầu: [README](../../../README.md), [IA](../../information_architecture/INFORMATION_ARCHITECTURE.md), [Business Rules](../../BUSINESS_RULES.md).
