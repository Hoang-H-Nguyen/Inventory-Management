// Generated from docs/openapi/openapi.json; edit source schema, then regenerate.
package com.stockmate.shared.contract;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public record LineCalculation(
        Long productId,
        String sku,
        String productName,
        String unit,
        Long supplierProductId,
        Long supplierId,
        String supplierName,
        Integer supplierPriceVersion,
        Integer policyVersion,
        Integer inventoryVersion,
        Instant priceUpdatedAt,
        Long unitPriceVnd,
        Integer stockOnHand,
        Integer stockOnOrder,
        Integer backorders,
        Long inventoryPosition,
        LocalDate windowStart,
        LocalDate windowEnd,
        Integer observedDays,
        BigDecimal averageDailyDemand,
        Integer leadTimeDays,
        Integer safetyStock,
        Integer targetStock,
        BigDecimal reorderPoint,
        Integer suggestedQuantity,
        Integer selectedQuantity,
        Long lineTotalVnd,
        String status,
        List<String> missingFields
) {}
