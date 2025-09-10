"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OllamaAdapter = void 0;
const BaseAdapter_1 = require("./BaseAdapter");
/**
 * Ollama Adapter
 *
 * This adapter provides integration with Ollama, a tool for running large language
 * models locally. Since Ollama runs locally, no API key is required.
 */
class OllamaAdapter extends BaseAdapter_1.BaseAdapter {
    constructor(config) {
        super('ollama', config);
    }
    /**
     * Establish connection to Ollama
     */
    async connect(config) {
        try {
            // In a real implementation, this would check if Ollama is available
            // and properly configured in the user's environment
            // For Ollama, we don't need an API key since it runs locally
            // We just need to verify that Ollama is installed and accessible
            // Check if base URL is provided, otherwise use default
            const baseUrl = config.baseUrl || 'http://localhost:11434';
            // Simulate checking for Ollama installation and accessibility
            const isOllamaAvailable = await this.checkOllamaInstallation(baseUrl);
            if (!isOllamaAvailable) {
                return {
                    success: false,
                    message: 'Ollama is not installed or not accessible. Please install Ollama from https://ollama.ai',
                    error: 'Ollama not found'
                };
            }
            // For now, we'll simulate a connection attempt
            this.connected = true;
            this.health = 'healthy';
            this.lastActivity = new Date();
            return {
                success: true,
                message: 'Connected to Ollama',
                credentials: {
                    provider: 'ollama',
                    scopes: ['read', 'write', 'chat']
                }
            };
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to connect to Ollama: ${error instanceof Error ? error.message : 'Unknown error'}`,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    /**
     * Check if Ollama is installed and accessible
     */
    async checkOllamaInstallation(baseUrl) {
        // In a real implementation, this would check:
        // 1. If Ollama daemon is running
        // 2. If the API endpoint is accessible
        // 3. If required models are available
        // For now, we'll simulate a successful check
        return true;
    }
    /**
     * Send specification to Ollama
     */
    async sendSpec(spec, options) {
        if (!this.connected) {
            throw new Error('Not connected to Ollama');
        }
        try {
            // In a real implementation, this would send the spec to Ollama
            // For now, we'll simulate the operation
            this.lastActivity = new Date();
            return {
                success: true,
                messageId: `ollama-${Date.now()}`,
                estimatedTokens: 800, // Simulated token count
                processingTime: 150 // Simulated processing time in ms
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
}
exports.OllamaAdapter = OllamaAdapter;
