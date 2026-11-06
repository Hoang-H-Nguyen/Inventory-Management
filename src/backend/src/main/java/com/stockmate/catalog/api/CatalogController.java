package com.stockmate.catalog.api;

import java.util.List;
import com.stockmate.shared.contract.*;
import com.stockmate.shared.api.NotImplementedException;
import org.springframework.web.bind.annotation.*;

/** HTTP signatures from docs/openapi/openapi.json. All handlers are deliberate 501 stubs.
 * Roles below document requirements; actual role/ownership checks are not implemented.
 */
@RestController
@RequestMapping("/api/v1")
public class CatalogController {
    /** Search products | Roles: WAREHOUSE_STAFF, INVENTORY_PLANNER. */
    @GetMapping("/products")
    public ProductList listProducts(
            @RequestParam(value = "page", required = false, defaultValue = "1") Integer page,
            @RequestParam(value = "page_size", required = false, defaultValue = "20") Integer pageSize,
            @RequestParam(value = "search", required = false) String search
    ) {
        // TODO: authenticate, authorize and delegate to CatalogService.
        throw new NotImplementedException("listProducts");
    }

    /** Create product | Roles: INVENTORY_PLANNER. */
    @PostMapping("/products")
    public Product createProduct(
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody ProductInput body
    ) {
        // TODO: authenticate, authorize and delegate to CatalogService.
        throw new NotImplementedException("createProduct");
    }

    /** Product details | Roles: WAREHOUSE_STAFF, INVENTORY_PLANNER. */
    @GetMapping("/products/{productId}")
    public Product getProduct(@PathVariable(value = "productId", required = true) Long productId) {
        // TODO: authenticate, authorize and delegate to CatalogService.
        throw new NotImplementedException("getProduct");
    }

    /** Update or deactivate product | Roles: INVENTORY_PLANNER. */
    @PatchMapping("/products/{productId}")
    public Product updateProduct(
            @PathVariable(value = "productId", required = true) Long productId,
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody ProductUpdate body
    ) {
        // TODO: authenticate, authorize and delegate to CatalogService.
        throw new NotImplementedException("updateProduct");
    }

    /** List suppliers | Roles: INVENTORY_PLANNER. */
    @GetMapping("/suppliers")
    public SupplierList listSuppliers(
            @RequestParam(value = "page", required = false, defaultValue = "1") Integer page,
            @RequestParam(value = "page_size", required = false, defaultValue = "20") Integer pageSize,
            @RequestParam(value = "search", required = false) String search
    ) {
        // TODO: authenticate, authorize and delegate to CatalogService.
        throw new NotImplementedException("listSuppliers");
    }

    /** Create supplier | Roles: INVENTORY_PLANNER. */
    @PostMapping("/suppliers")
    public Supplier createSupplier(
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody SupplierInput body
    ) {
        // TODO: authenticate, authorize and delegate to CatalogService.
        throw new NotImplementedException("createSupplier");
    }

    /** Update or deactivate supplier | Roles: INVENTORY_PLANNER. */
    @PatchMapping("/suppliers/{supplierId}")
    public Supplier updateSupplier(
            @PathVariable(value = "supplierId", required = true) Long supplierId,
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody SupplierUpdate body
    ) {
        // TODO: authenticate, authorize and delegate to CatalogService.
        throw new NotImplementedException("updateSupplier");
    }

    /** Supplier quotes for product | Roles: INVENTORY_PLANNER. */
    @GetMapping("/products/{productId}/suppliers")
    public SupplierProductList listSupplierProducts(
            @PathVariable(value = "productId", required = true) Long productId,
            @RequestParam(value = "page", required = false, defaultValue = "1") Integer page,
            @RequestParam(value = "page_size", required = false, defaultValue = "20") Integer pageSize,
            @RequestParam(value = "search", required = false) String search
    ) {
        // TODO: authenticate, authorize and delegate to CatalogService.
        throw new NotImplementedException("listSupplierProducts");
    }

    /** Set product supplier price | Roles: INVENTORY_PLANNER. */
    @PostMapping("/products/{productId}/suppliers")
    public SupplierProduct createSupplierProduct(
            @PathVariable(value = "productId", required = true) Long productId,
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody SupplierProductInput body
    ) {
        // TODO: authenticate, authorize and delegate to CatalogService.
        throw new NotImplementedException("createSupplierProduct");
    }

    /** Update supplier price | Roles: INVENTORY_PLANNER. */
    @PatchMapping("/supplier-products/{supplierProductId}")
    public SupplierProduct updateSupplierProduct(
            @PathVariable(value = "supplierProductId", required = true) Long supplierProductId,
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody SupplierProductUpdate body
    ) {
        // TODO: authenticate, authorize and delegate to CatalogService.
        throw new NotImplementedException("updateSupplierProduct");
    }

    /** Set replenishment policy | Roles: INVENTORY_PLANNER. */
    @PutMapping("/products/{productId}/policy")
    public Policy setPolicy(
            @PathVariable(value = "productId", required = true) Long productId,
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody PolicyInput body
    ) {
        // TODO: authenticate, authorize and delegate to CatalogService.
        throw new NotImplementedException("setPolicy");
    }

}
