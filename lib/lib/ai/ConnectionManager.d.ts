/**
 * Simplified AI Connection Manager
 *
 * Core functionality for managing AI assistant connections with proper error handling.
 */
import { AIProvider, AIAssistant, AIConfig, ConnectionResult, ConnectionStatus, AIAdapterFactory } from './adapters/AdapterInterface';
export interface ConnectionState {
    provider: AIProvider;
    adapter: AIAssistant;
    config: AIConfig;
    status: ConnectionResult;
    connectedAt: Date;
    lastActivity: Date;
    health: 'healthy' | 'degraded' | 'failing';
}
/**
 * Simplified central manager for AI assistant connections
 */
export declare class ConnectionManager {
    private static instance;
    private connections;
    private adapterFactories;
    private constructor();
    static getInstance(): ConnectionManager;
    /**
     * Register an adapter factory
     */
    registerAdapterFactory(factory: AIAdapterFactory): void;
    /**
     * Connect to an AI assistant
     */
    connect(provider: AIProvider, config?: Partial<AIConfig>): Promise<ConnectionResult>;
    /**
     * Disconnect from an AI assistant
     */
    disconnect(provider: AIProvider): Promise<void>;
    /**
     * Get connection status for an AI assistant
     */
    getConnectionStatus(provider: AIProvider): Promise<ConnectionStatus | null>;
    /**
     * Get status for all connections
     */
    getAllConnectionStatuses(): Promise<ConnectionStatus[]>;
    /**
     * Send spec to connected AI assistant
     */
    sendSpecToProvider(provider: AIProvider, spec: any): Promise<any>;
    /**
     * Get supported AI providers
     */
    getSupportedProviders(): AIProvider[];
    /**
     * Check if a provider is currently connected
     */
    isConnected(provider: AIProvider): boolean;
    /**
     * Get active connections count
     */
    getActiveConnectionsCount(): number;
    /**
     * Cleanup on process exit
     */
    cleanup(): Promise<void>;
}
export declare const connectionManager: ConnectionManager;
