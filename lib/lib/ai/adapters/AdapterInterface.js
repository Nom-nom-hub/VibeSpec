"use strict";
/**
 * Universal AI Assistant Adapter Interface
 *
 * This interface defines the universal contract that all AI assistant adapters must implement.
 * It provides a consistent API for connecting to and communicating with different AI assistants.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AISyncConflictError = exports.AIAuthenticationError = exports.AIConnectionError = void 0;
// Common error types
class AIConnectionError extends Error {
    constructor(message, provider, code, retryable = true) {
        super(message);
        this.provider = provider;
        this.code = code;
        this.retryable = retryable;
        this.name = 'AIConnectionError';
    }
}
exports.AIConnectionError = AIConnectionError;
class AIAuthenticationError extends Error {
    constructor(message, provider, canRetry = true) {
        super(message);
        this.provider = provider;
        this.canRetry = canRetry;
        this.name = 'AIAuthenticationError';
    }
}
exports.AIAuthenticationError = AIAuthenticationError;
class AISyncConflictError extends Error {
    constructor(message, conflicts) {
        super(message);
        this.conflicts = conflicts;
        this.name = 'AISyncConflictError';
    }
}
exports.AISyncConflictError = AISyncConflictError;
