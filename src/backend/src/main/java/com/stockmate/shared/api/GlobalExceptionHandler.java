package com.stockmate.shared.api;

import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(NotImplementedException.class)
    ResponseEntity<Map<String, String>> notImplemented(NotImplementedException error) {
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED)
                .body(Map.of("code", "NOT_IMPLEMENTED", "message", error.getMessage()));
    }
    // TODO: map validation, missing data, ownership, version conflicts and business errors
    // to the existing OpenAPI Error shape. Never expose internal exception messages.
}
