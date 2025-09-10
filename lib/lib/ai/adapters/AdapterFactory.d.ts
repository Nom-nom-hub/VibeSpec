import { AIAdapterFactory, AIConfig, AIProvider } from './AdapterInterface';
/**
 * Factory for creating AI adapters
 *
 * This factory creates instances of AI adapters based on the provider specified
 * in the configuration.
 */
export declare class AdapterFactory implements AIAdapterFactory {
    /**
     * Create an AI adapter instance
     */
    create(config: AIConfig): any;
    /**
     * Check if this factory supports the given provider
     */
    supports(provider: AIProvider): boolean;
    /**
     * Get supported providers by this factory
     */
    getSupportedProviders(): AIProvider[];
    /**
     * Get configuration template for a provider
     */
    getConfigTemplate(provider: AIProvider): Partial<AIConfig>;
}
