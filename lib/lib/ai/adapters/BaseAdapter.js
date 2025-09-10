"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAdapter = void 0;
/**
 * Base adapter class implementing common functionality for all AI assistants
 * This provides default implementations that can be overridden by specific adapters
 */
class BaseAdapter {
    constructor(provider, config) {
        this.connected = false;
        this.lastActivity = null;
        this.health = 'unreachable';
        this.provider = provider;
        this.config = config;
    }
    /**
     * Terminate the connection to the AI assistant
     */
    async disconnect() {
        this.connected = false;
        this.health = 'unreachable';
        this.lastActivity = new Date();
    }
    /**
     * Check if the connection is active and healthy
     */
    async isConnected() {
        return this.connected;
    }
    /**
     * Get detailed connection status
     */
    async getConnectionStatus() {
        return {
            provider: this.provider,
            connected: this.connected,
            lastActivity: this.lastActivity || undefined,
            health: this.health,
            version: '1.0.0',
            features: []
        };
    }
    /**
     * Send a specification update/revision to the AI
     */
    async sendUpdate(update) {
        if (!this.connected) {
            throw new Error(`Not connected to ${this.provider}`);
        }
        this.lastActivity = new Date();
        // Default implementation - to be overridden by specific adapters
    }
    /**
     * Generate optimized context for AI consumption
     */
    async generateContext(spec) {
        return {
            summary: spec.description || 'No description provided',
            keyRequirements: [],
            implementationOrder: [],
            potentialChallenges: []
        };
    }
    /**
     * Request AI analysis and improvement suggestions for a specification
     */
    async requestRefinement(spec, focus) {
        if (!this.connected) {
            throw new Error(`Not connected to ${this.provider}`);
        }
        this.lastActivity = new Date();
        // Default implementation - to be overridden by specific adapters
        return [];
    }
    /**
     * Request AI-generated implementation suggestions
     */
    async requestImplementation(spec) {
        if (!this.connected) {
            throw new Error(`Not connected to ${this.provider}`);
        }
        this.lastActivity = new Date();
        // Default implementation - to be overridden by specific adapters
        return [];
    }
    /**
     * Get AI recommendations for template selection
     */
    async suggestTemplate(requirements) {
        if (!this.connected) {
            throw new Error(`Not connected to ${this.provider}`);
        }
        this.lastActivity = new Date();
        // Default implementation - to be overridden by specific adapters
        return [];
    }
    /**
     * Start real-time synchronization for a specification
     */
    async startSync(specId, options) {
        if (!this.connected) {
            throw new Error(`Not connected to ${this.provider}`);
        }
        this.lastActivity = new Date();
        // Default implementation - to be overridden by specific adapters
    }
    /**
     * Stop real-time synchronization
     */
    async stopSync(specId) {
        this.lastActivity = new Date();
        // Default implementation - to be overridden by specific adapters
    }
    /**
     * Get current synchronization status
     */
    async getSyncStatus(specId) {
        return {
            active: false,
            pendingChanges: 0,
            conflicts: 0
        };
    }
    /**
     * Pause synchronization temporarily
     */
    async pauseSync(specId) {
        this.lastActivity = new Date();
    }
    /**
     * Resume synchronization
     */
    async resumeSync(specId) {
        this.lastActivity = new Date();
    }
    /**
     * Validate connection configuration
     */
    validateConfig(config) {
        const errors = [];
        // Basic validation that can be extended by specific adapters
        if (!config.provider) {
            errors.push('Provider is required');
        }
        return {
            valid: errors.length === 0,
            errors
        };
    }
    /**
     * Get supported features for this AI provider
     */
    async getSupportedFeatures() {
        return [];
    }
    /**
     * Get usage/attribution information
     */
    async getUsageInfo() {
        return {};
    }
    /**
     * Cleanup resources (called on process exit)
     */
    async cleanup() {
        await this.disconnect();
    }
}
exports.BaseAdapter = BaseAdapter;
