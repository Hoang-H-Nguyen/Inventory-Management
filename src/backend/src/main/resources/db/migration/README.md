# Flyway migrations

Chưa có migration SQL được thực thi. Tạo `V1__initial_schema.sql` từ
[database design](../../../../../../../docs/database/DATABASE_DESIGN.md)
theo [kế hoạch database](../../../../../../database/README.md).
Không để Hibernate tự tạo/sửa schema; `ddl-auto` đang là `validate`.
Các bảng, entity JPA và repository adapter vẫn cần được triển khai.
