"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdapterFactory = void 0;
const CursorAdapter_1 = require("./CursorAdapter");
const CopilotAdapter_1 = require("./CopilotAdapter");
const ClaudeAdapter_1 = require("./ClaudeAdapter");
const OllamaAdapter_1 = require("./OllamaAdapter");
const GeminiAdapter_1 = require("./GeminiAdapter");
const QwenAdapter_1 = require("./QwenAdapter");
const CLIWrapperAdapter_1 = require("./CLIWrapperAdapter");
const OpenAIAdapter_1 = require("./OpenAIAdapter");
/**
 * Factory for creating AI adapters
 *
 * This factory creates instances of AI adapters based on the provider specified
 * in the configuration.
 */
class AdapterFactory {
    /**
     * Create an AI adapter instance
     */
    create(config) {
        switch (config.provider) {
            case 'cursor':
                return new CursorAdapter_1.CursorAdapter(config);
            case 'copilot':
                return new CopilotAdapter_1.CopilotAdapter(config);
            case 'claude':
                return new ClaudeAdapter_1.ClaudeAdapter(config);
            case 'ollama':
                return new OllamaAdapter_1.OllamaAdapter(config);
            case 'gemini':
                return new GeminiAdapter_1.GeminiAdapter(config);
            case 'qwen':
                return new QwenAdapter_1.QwenAdapter(config);
            case 'openai':
                return new OpenAIAdapter_1.OpenAIAdapter(config);
            case 'starcoder':
            case 'codegeex':
            case 'codet5':
            case 'polycoder':
            case 'mpt-code':
            case 'a-code':
                // Use CLI wrapper for these local models
                return new CLIWrapperAdapter_1.CLIWrapperAdapter(config);
            default:
                throw new Error(`Unsupported AI provider: ${config.provider}`);
        }
    }
    /**
     * Check if this factory supports the given provider
     */
    supports(provider) {
        const supportedProviders = [
            'cursor', 'copilot', 'claude', 'ollama', 'gemini', 'qwen', 'openai',
            'starcoder', 'codegeex', 'codet5', 'polycoder', 'mpt-code', 'a-code'
        ];
        return supportedProviders.includes(provider);
    }
    /**
     * Get supported providers by this factory
     */
    getSupportedProviders() {
        return [
            'cursor', 'copilot', 'claude', 'ollama', 'gemini', 'qwen', 'openai',
            'starcoder', 'codegeex', 'codet5', 'polycoder', 'mpt-code', 'a-code'
        ];
    }
    /**
     * Get configuration template for a provider
     */
    getConfigTemplate(provider) {
        switch (provider) {
            case 'cursor':
                return {
                    model: 'gpt-4',
                    timeout: 30000
                };
            case 'copilot':
                return {
                    model: 'gpt-4',
                    timeout: 30000
                };
            case 'claude':
                return {
                    model: 'claude-2',
                    timeout: 30000
                };
            case 'ollama':
                return {
                    model: 'llama2',
                    baseUrl: 'http://localhost:11434'
                };
            case 'gemini':
                return {
                    model: 'gemini-pro',
                    timeout: 30000
                };
            case 'qwen':
                return {
                    model: 'qwen-max',
                    timeout: 30000
                };
            case 'openai':
                return {
                    model: 'gpt-3.5-turbo',
                    timeout: 30000
                };
            case 'starcoder':
                return {
                    model: 'starcoder-base',
                    timeout: 30000
                };
            case 'codegeex':
                return {
                    model: 'codegeex2-6b',
                    timeout: 30000
                };
            case 'codet5':
                return {
                    model: 'codet5-base',
                    timeout: 30000
                };
            case 'polycoder':
                return {
                    model: 'polycoder',
                    timeout: 30000
                };
            case 'mpt-code':
                return {
                    model: 'mpt-7b-instruct',
                    timeout: 30000
                };
            case 'a-code':
                return {
                    model: 'a-code-1b',
                    timeout: 30000
                };
            default:
                return {};
        }
    }
}
exports.AdapterFactory = AdapterFactory;
