# StockMate — UI/UX Walkthrough

Tài liệu này mô tả prototype web hiện tại, được cập nhật theo [README](../../README.md), [Information Architecture](../information_architecture/INFORMATION_ARCHITECTURE.md) và [Business Rules](../BUSINESS_RULES.md), bao phủ US01–US14.

Prototype StockMate hỗ trợ theo dõi Inventory Position, đề xuất nhiều sản phẩm/nhà cung cấp, ngân sách riêng, AI hỗ trợ bản nháp và các chứng từ outstanding. Tài liệu sử dụng 10 ảnh giao diện tiêu biểu chụp từ prototype.

## 1. Mở và trải nghiệm

Mở [prototype/index.html](./prototype/index.html) trực tiếp bằng trình duyệt. Không cần build hay thư viện frontend. Nếu trình duyệt không cho lưu localStorage qua file, chạy server từ thư mục repo:

~~~sh
node docs/ui_ux/prototype/serve.mjs
~~~

Mở **http://127.0.0.1:4173**. Xem [hướng dẫn chạy và kiểm tra](./prototype/README.md) để biết cấu trúc mã nguồn, cách đặt lại dữ liệu và chụp lại 10 ảnh.

### Đăng nhập và đổi mật khẩu — US13

![Đăng nhập StockMate](./prototype/screenshots/00-login.png)

Màn hình đăng nhập giới thiệu ngắn gọn giá trị của StockMate: **Nắm chắc tồn kho. Chủ động nhập hàng.** Bố cục hai phần gồm giới thiệu ứng dụng và form đăng nhập với tên đăng nhập, mật khẩu, nút **Đăng nhập** cùng hướng dẫn liên hệ quản trị viên. Trên điện thoại, hai phần xếp dọc để dễ đọc và thao tác.

Ảnh minh họa là trạng thái ban đầu: các ô nhập trống, không hiển thị tài khoản, mật khẩu mẫu hay nút điền sẵn. Thông tin dùng để kiểm tra prototype được ghi riêng trong [hướng dẫn kỹ thuật](./prototype/README.md#tài-khoản-và-đăng-nhập). Người dùng đăng nhập bằng tài khoản do quản trị viên cấp; tên và vai trò ở thanh trên phản ánh tài khoản hiện tại, không có bộ chọn vai trò.

Tài khoản do Admin tạo hoặc cấp lại mật khẩu phải đổi mật khẩu tạm trước khi vào nghiệp vụ. Mật khẩu cần 8–128 ký tự; kiểm tra mật khẩu hiện tại, xác nhận khớp và mật khẩu mới khác mật khẩu hiện tại.

Sai mật khẩu hoặc tài khoản bị khóa hiển thị lỗi chung. Username được chuẩn hóa chữ thường. **Đăng xuất** kết thúc phiên của tab; đổi mật khẩu, cấp lại mật khẩu, đổi vai trò hoặc khóa tài khoản làm các phiên trước đó hết hiệu lực. Đổi mật khẩu thành công giữ một phiên cho tab hiện tại. Có thể mở hai tab để thử thu hồi phiên.

**Đặt lại mẫu** chỉ khôi phục dữ liệu nghiệp vụ; tài khoản và mật khẩu đã chỉnh được giữ nguyên.



| Vai trò | Điều hướng và nhiệm vụ |
|---|---|
| Admin | Quản trị tài khoản; tạo/sửa/khóa/mở khóa/cấp mật khẩu tạm |
| Nhân viên kho | Tồn kho, Đơn đã đặt, Khách chờ hàng; nhận hàng, xuất bán/giao khách và kiểm kê |
| Inventory Planner | Tồn kho, Phân tích nhu cầu, Cảnh báo bổ sung, Đề xuất, Sản phẩm & nhà cung cấp, Đơn đã đặt, Khách chờ hàng |
| Quản lý | Tổng quan và Đề xuất; xem xét, phê duyệt hoặc từ chối |

Luồng chính: **Theo dõi tồn kho → Phân tích nhu cầu → Xác định nhu cầu bổ sung → Chuẩn bị và gửi đề xuất → Quản lý quyết định**.

## 2. Nhân viên kho: theo dõi và ghi nhận tồn kho

### Tra cứu sản phẩm — US01

Mở Tồn kho, tìm theo SKU hoặc tên, rồi chọn **Chi tiết**. Bảng hiển thị đơn vị, tồn hiện có, đang đặt, khách chờ và Inventory Position. Kết quả tìm kiếm rỗng có thông báo và nút xóa tìm kiếm.

![Tồn kho — Nhân viên kho](./prototype/screenshots/02-inventory-staff.png)

**Inventory Position = Hiện có + Đang đặt − Khách chờ hàng.** Chi tiết sản phẩm hiển thị các số thành phần, nhà cung cấp và lịch sử biến động theo người ghi nhận, thời gian và lý do.

### Nhận hàng, xuất bán và kiểm kê — US02

Từ chi tiết sản phẩm, chọn đúng nghiệp vụ. Ảnh dưới minh họa nhận hàng theo đơn đã đặt.

![Nhận hàng theo đơn đã đặt](./prototype/screenshots/04-receipt.png)

| Nghiệp vụ | Nhập liệu và kiểm tra | Kết quả |
|---|---|---|
| Nhận hàng | Chọn đơn của đúng SKU, nhập số thực nhận và lý do; không vượt phần chưa nhận | Tăng hiện có, giảm đang đặt cùng số lượng |
| Bán trực tiếp | Nhập số thực giao và lý do; không vượt tồn hiện có | Giảm hiện có, ghi một lần bán |
| Giao khách chờ | Chọn backorder, nhập số giao và lý do; không vượt tồn hoặc phần còn nợ | Giảm hiện có và backorder, chỉ ghi một lần bán |
| Kiểm kê | Nhập tổng số đếm thực tế và lý do; cho phép tổng bằng 0 | Đặt tồn về tổng đã nhập, lưu chênh lệch qua lịch sử; không tạo doanh số |

Cho phép nhận/giao từng phần. Sau khi lưu, quay về chi tiết sản phẩm, hiển thị thông báo thành công và số tồn mới. Nhập sai giữ nguyên form và hiển thị lỗi để sửa.

Ví dụ độc lập, bắt đầu từ dữ liệu mẫu: SKU-001 hiện có 60 ram, đơn PO-026 còn 40 ram. Nhận thêm 20 ram → hiện có 80, đơn còn 20. Không tự coi phần còn lại là đã nhận hoặc đã hủy.

## 3. Planner: từ nhu cầu đến đề xuất

### Phân tích nhu cầu — US03, US04

Chọn sản phẩm và khoảng ngày để xem lịch sử bán. Bộ lọc lịch sử không thay đổi cửa sổ tính nhu cầu.

![Phân tích nhu cầu và lịch sử bán](./prototype/screenshots/11-demand.png)

Ngày nghiệp vụ demo là **02/11/2026**. Nhu cầu dùng **03/10–01/11/2026**, tức 30 ngày lịch đã hoàn tất, không gồm hôm nay:

~~~text
Nhu cầu trung bình/ngày = Tổng bán trong 30 ngày / 30
ROP = Nhu cầu trung bình/ngày × Lead time + Tồn an toàn
~~~

Lịch sử bao gồm giao backorder đúng một lần, loại trừ nhận hàng và kiểm kê. Chọn SKU-015 để thử thiếu dữ liệu: nhu cầu, ROP và khuyến nghị là **—**, có thông báo thiếu lịch sử; không coi thiếu dữ liệu là nhu cầu bằng 0.

### Kiểm tra cảnh báo — US05

Mở **Cảnh báo bổ sung**, chọn **Kiểm tra lại** hoặc mở cơ sở của từng SKU. Nhóm cần bổ sung chỉ gồm SKU có **Inventory Position ≤ ROP**; dữ liệu thiếu được tách riêng. Chi tiết cho thấy tồn hiện có, đang đặt, khách chờ, nhu cầu, lead time, an toàn và mục tiêu.

~~~text
Ví dụ SKU-008 — Bút bi Thiên Long, đơn vị cây:
Tổng bán 30 ngày = 150 → Nhu cầu = 150 / 30 = 5 cây/ngày
ROP = 5 × 4 + 10 = 30 cây
Position = 20 + 0 − 0 = 20 cây
20 ≤ 30 → Cần bổ sung
Gợi ý = max(0, 100 − 20) = 80 cây
80 × 5.000 VND = 400.000 VND
~~~

Chọn **Tạo bản nháp** để đưa sản phẩm sang đề xuất. Với dữ liệu thiếu, không tạo khuyến nghị giả.

### Chuẩn bị bản nháp qua form hoặc AI — US06

Mở **Đề xuất nhập hàng → Tạo đề xuất**, hoặc bắt đầu từ cảnh báo. Bản nháp có thể chứa nhiều sản phẩm và nhiều nhà cung cấp. Planner thêm/xóa dòng, chọn nhà cung cấp cho từng sản phẩm, sửa số lượng và ngân sách.

![Đề xuất nhiều sản phẩm, ngân sách và trợ lý bản nháp](./prototype/screenshots/16-draft.png)

| Thành phần | Hành vi hiện tại |
|---|---|
| Gợi ý số lượng | max(0, Mục tiêu − Inventory Position); tách khỏi số lượng Planner chọn |
| Nhà cung cấp | Chọn trong các NCC liên kết với sản phẩm; cập nhật đơn giá dòng |
| Thành tiền | Số lượng chọn × Đơn giá; tính lại khi thay đổi |
| Ngân sách | Hạn mức riêng từng đề xuất; không có quỹ chung |
| Vượt ngân sách | Hiển thị số vượt và vô hiệu hóa gửi; Planner sửa số lượng, xóa dòng hoặc tăng hạn mức |
| Lưu bản nháp | Lưu cục bộ để xem lại; thay đổi hợp lệ cũng được lưu khi xác nhận trường |
| Gửi phê duyệt | Chỉ Planner gửi Draft → Pending; yêu cầu có sản phẩm, số lượng nguyên dương và không vượt ngân sách |
| Trợ lý AI mẫu | Giải thích hoặc đề nghị số lượng từ dữ liệu mẫu; Planner chọn áp dụng vào Draft |
| AI lỗi | Nút mô phỏng lỗi hiển thị thông báo; form và việc lưu/gửi vẫn hoạt động |

Bộ mẫu DX-042: giấy A4 210 ram × 60.000 = 12.600.000 VND, bút 80 cây × 5.000 = 400.000 VND. Tổng **13.000.000 VND**, ngân sách **14.000.000 VND**. Đổi ngân sách thành 10.000.000 để thử vượt 3.000.000; số lượng không tự giảm.

AI không gửi đề xuất, không duyệt và không ghi nhận kho/đơn hàng. Đây là phản hồi mô phỏng có nhãn, chưa gọi dịch vụ AI. Khi triển khai thật, AI phải sử dụng dữ liệu truy xuất và kết quả tính từ backend.

### Theo dõi và sao chép — US07, US09

Danh sách có bộ lọc Draft/Pending/Approved/Rejected. Chi tiết lưu sản phẩm, nhà cung cấp, số lượng, giá, tổng tiền, ngân sách và lịch sử chỉnh sửa/quyết định.

Sau khi gửi, vẫn ở chi tiết với trạng thái Chờ duyệt và nội dung chỉ đọc. Planner có thể mở DX-039 bị từ chối, chọn **Sao chép thành bản nháp**: bản mới liên kết về bản gốc, lấy lại dữ liệu/giá hiện tại và cho phép sửa. Bản gốc cùng lý do và lịch sử được giữ nguyên.

## 4. Quản lý: theo dõi và quyết định

### Dashboard — US10

Dashboard hiển thị số SKU hoạt động, SKU cần bổ sung, đề xuất Pending và SKU thiếu dữ liệu. Các số lấy từ bộ dữ liệu trong trình duyệt, không dùng tổng giả lập ngoài danh mục.

![Dashboard — Quản lý](./prototype/screenshots/01-dashboard.png)

### Duyệt hoặc từ chối — US07, US08, US09

Mở danh sách đề xuất, chọn DX-041 Chờ duyệt. Đọc các dòng sản phẩm/NCC, chi phí, ngân sách và lịch sử trước khi quyết định.

![Chi tiết đề xuất chờ Quản lý quyết định](./prototype/screenshots/21-review.png)

| Thao tác | Kết quả và phản hồi |
|---|---|
| Phê duyệt | Pending → Approved, lưu người và thời gian; ở lại chi tiết |
| Từ chối | Mở hộp thoại; bắt buộc lý do không rỗng trước khi lưu Rejected |
| Xem đề xuất đã xử lý | Hiển thị quyết định/lý do và lịch sử; không còn nút quyết định lần hai |
| Xem Draft | Manager không có quyền xem bản nháp của Planner |

**Phê duyệt chỉ ghi nhận quyết định.** Không tự tạo đơn mua, không tăng đang đặt hay hiện có. Planner ghi nhận riêng đơn đã thực sự đặt với NCC.

## 5. Dữ liệu nền và phần chưa hoàn tất

### Sản phẩm, nhà cung cấp và chính sách — US11

![Danh mục sản phẩm, giá theo NCC và chính sách tồn](./prototype/screenshots/26-catalog.png)

Planner thêm/chỉnh sản phẩm, đơn vị, lead time, tồn an toàn, mục tiêu; liên kết một hoặc nhiều NCC với đơn giá riêng. Form nhà cung cấp hỗ trợ thêm/chỉnh tên và liên hệ.

Sản phẩm mới bắt đầu với hiện có 0 và trạng thái thiếu lịch sử bán. Giá/tên/đơn vị trong đề xuất đã lập là snapshot: sửa danh mục không sửa thông tin lịch sử của đề xuất. Bản sao từ đề xuất bị từ chối phải được kiểm tra lại trước khi gửi.

### Đơn đã đặt và khách chờ hàng — US12

![Theo dõi đơn đã đặt và phần chưa nhận](./prototype/screenshots/29-orders.png)

| Vai trò | Đơn đã đặt | Khách chờ hàng |
|---|---|---|
| Planner | Ghi nhận SKU, NCC, số đã đặt thực tế, ngày và ghi chú | Ghi nhận SKU, khách hàng, số chưa đáp ứng, ngày và ghi chú |
| Staff | Mở chứng từ để nhận từng phần | Mở chứng từ để giao từng phần |
| Planner | Hủy số chưa nhận kèm lý do | Hủy số chưa giao kèm lý do |

~~~text
Đang đặt = Số đặt ban đầu − Đã nhận − Đã hủy
Backorder = Số chờ ban đầu − Đã giao − Đã hủy
~~~

Chi tiết chứng từ lưu lịch sử. Hộp thoại hủy giới hạn số lượng trong phần outstanding và bắt buộc lý do. Hủy không thay đổi tồn hiện có.

Ví dụ backorder độc lập: hiện có 60, khách chờ 10 ram → giao 6 → hiện có 54, khách chờ 4 → hủy 4 còn lại → hiện có vẫn 54, khách chờ 0.

## 6. Admin: quản trị tài khoản — US14

![Quản trị tài khoản](./prototype/screenshots/30-user-administration.png)

Admin đăng nhập vào trang quản trị tài khoản, tìm theo username/họ tên và lọc theo vai trò hoặc trạng thái. Admin không mặc định có quyền kho, đề xuất hay phê duyệt.

| Thao tác | Hành vi |
|---|---|
| Tạo tài khoản | Nhập username, họ tên, một vai trò và mật khẩu tạm; tài khoản bắt đầu hoạt động và phải đổi mật khẩu |
| Sửa tài khoản | Cập nhật họ tên, vai trò và trạng thái; username không sửa |
| Khóa / Mở khóa | Chọn trạng thái trong form chỉnh sửa; giữ ID và toàn bộ lịch sử nghiệp vụ |
| Cấp mật khẩu tạm | Mở hộp thoại, nhập mật khẩu tạm; các phiên trước đó hết hiệu lực và lần đăng nhập tiếp phải đổi mật khẩu |
| Xem hoạt động | Danh sách sự kiện có người thực hiện, tài khoản liên quan và thời điểm; không hiển thị mật khẩu |

Username cần 3–32 ký tự gồm chữ Latin, số, dấu chấm, gạch dưới hoặc gạch ngang; kiểm tra trùng không phân biệt hoa/thường. Không đăng ký công khai, không gửi email đặt lại và không xóa cứng tài khoản.

Admin không được tự khóa hoặc tự bỏ quyền Admin; hệ thống luôn giữ ít nhất một Admin hoạt động. Người tạo và lịch sử đề xuất lưu ID cùng tên tại thời điểm thực hiện. Đổi tên/vai trò hoặc khóa tài khoản không viết lại lịch sử. Planner chỉ xem/chỉnh/gửi bản nháp thuộc tài khoản của mình; các đề xuất đã gửi được xem theo quyền nghiệp vụ.

## 7. Kiểm chứng và giới hạn prototype

Kết quả kiểm tra nằm trong [verification.json](./prototype/verification.json); script tái chạy là [verify.mjs](./prototype/verify.mjs). Bộ kiểm tra bao gồm quyền theo vai trò trong UI, tìm kiếm, nhu cầu, dữ liệu thiếu, nhận/giao từng phần, kiểm kê, hủy outstanding, tính ngân sách, trạng thái đề xuất, snapshot giá, giữ bản bị từ chối và bố cục mobile.

Prototype dùng HTML/CSS/JavaScript, localStorage cho dữ liệu và tài khoản, sessionStorage cho phiên theo tab. Đăng nhập, kiểm tra quyền và quản trị tài khoản được mô phỏng cục bộ; dữ liệu có thể bị chỉnh bằng công cụ trình duyệt. Chưa có backend xác thực, phân quyền bảo mật thực tế, đồng bộ nhiều người dùng hoặc tích hợp nhà cung cấp. Phép tính cục bộ chỉ minh họa nghiệp vụ; triển khai thật cần backend xác thực và tính toán. Nút kiểm tra cảnh báo hoạt động theo yêu cầu; lịch chạy hằng ngày chưa có.

Ngày tính nhu cầu được cố định để tái lập ví dụ. Dấu thời gian thao tác được ghi bằng giờ thực tế theo Asia/Ho_Chi_Minh. Các ảnh là trạng thái độc lập được đặt lại fixture, không phải một chuỗi giao dịch liên tục; nên dùng **Đặt lại mẫu** trước khi thử từng ví dụ.
