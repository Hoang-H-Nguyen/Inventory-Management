package com.stockmate.catalog.application;

import com.stockmate.shared.contract.*;

/** Proposed application port, not yet wired to HTTP or persistence.
 * TODO: add server-derived actor/session context before implementation;
 * never accept acting user or role from a request body.
 * Planner quản lý; Staff chỉ đọc thông tin sản phẩm. Tạo sản phẩm cùng tồn kho; bảo toàn snapshot đề xuất đã gửi.
 */
public interface CatalogService {
    // GET /products | WAREHOUSE_STAFF, INVENTORY_PLANNER
    ProductList listProducts(Integer page, Integer pageSize, String search);

    // POST /products | INVENTORY_PLANNER
    Product createProduct(String idempotencyKey, ProductInput body);

    // GET /products/{productId} | WAREHOUSE_STAFF, INVENTORY_PLANNER
    Product getProduct(Long productId);

    // PATCH /products/{productId} | INVENTORY_PLANNER
    Product updateProduct(Long productId, String idempotencyKey, ProductUpdate body);

    // GET /suppliers | INVENTORY_PLANNER
    SupplierList listSuppliers(Integer page, Integer pageSize, String search);

    // POST /suppliers | INVENTORY_PLANNER
    Supplier createSupplier(String idempotencyKey, SupplierInput body);

    // PATCH /suppliers/{supplierId} | INVENTORY_PLANNER
    Supplier updateSupplier(Long supplierId, String idempotencyKey, SupplierUpdate body);

    // GET /products/{productId}/suppliers | INVENTORY_PLANNER
    SupplierProductList listSupplierProducts(Long productId, Integer page, Integer pageSize, String search);

    // POST /products/{productId}/suppliers | INVENTORY_PLANNER
    SupplierProduct createSupplierProduct(Long productId, String idempotencyKey, SupplierProductInput body);

    // PATCH /supplier-products/{supplierProductId} | INVENTORY_PLANNER
    SupplierProduct updateSupplierProduct(Long supplierProductId, String idempotencyKey, SupplierProductUpdate body);

    // PUT /products/{productId}/policy | INVENTORY_PLANNER
    Policy setPolicy(Long productId, String idempotencyKey, PolicyInput body);

}
