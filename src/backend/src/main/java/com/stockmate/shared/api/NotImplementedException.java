package com.stockmate.shared.api;

public final class NotImplementedException extends RuntimeException {
    public NotImplementedException(String operation) {
        super("Scaffold operation not implemented: " + operation);
    }
}
