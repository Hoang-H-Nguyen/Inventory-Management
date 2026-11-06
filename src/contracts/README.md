# API contract

Nguồn chuẩn: [openapi.json](../../docs/openapi/openapi.json),
[openapi.yaml](../../docs/openapi/openapi.yaml) và [API overview](../../docs/openapi/README.md).
Không sao chép đặc tả sang một bản OpenAPI thứ hai.

`api-map.json` liệt kê operation, path, module và role của toàn bộ endpoint.
`shared/contract/*.java` là transport DTO sinh từ schema, dùng wrapper cho nullable/optional,
BigDecimal cho giá trị thập phân và Long cho ID/tiền VND. DTO enum hiện là String;
validation required/range/enum và các constraint chéo chưa được triển khai.
Các record chứa credential/token đã che `toString()`; vẫn không được log request body.

Chạy `python3 src/scripts/generate-contracts.py` từ root repository để sinh lại DTO
và api-map. Script ghi đè các file generated cùng tên. Sau khi sửa đặc tả, đồng bộ thủ công
controller/service và frontend api.js; chúng là file khung để tiếp tục phát triển.

HTTP controller hiện chỉ trả 501 nếu vượt qua security gate. Đây là hành vi riêng của
scaffold, không phải response nghiệp vụ mới được bổ sung vào OpenAPI.
