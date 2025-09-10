/**
 * Simplified AI Connection Manager
 *
 * Core functionality for managing AI assistant connections with proper error handling.
 */

import {
  AIProvider,
  AIAssistant,
  AIConfig,
  ConnectionResult,
  ConnectionStatus,
  AIAdapterFactory,
  AIConnectionError
} from './adapters/AdapterInterface';
import { tokenManager } from './TokenManager';
import { AdapterFactory } from './adapters/AdapterFactory';

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
export class ConnectionManager {
  private static instance: ConnectionManager;
  private connections = new Map<AIProvider, ConnectionState>();
  private adapterFactories = new Map<AIProvider, AIAdapterFactory>();

  private constructor() {
    // Register the default adapter factory
    const defaultFactory = new AdapterFactory();
    this.registerAdapterFactory(defaultFactory);
  }

  public static getInstance(): ConnectionManager {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager();
    }
    return ConnectionManager.instance;
  }

  /**
   * Register an adapter factory
   */
  registerAdapterFactory(factory: AIAdapterFactory): void {
    const providers = factory.getSupportedProviders();
    providers.forEach(provider => {
      this.adapterFactories.set(provider, factory);
    });
  }

  /**
   * Connect to an AI assistant
   */
  async connect(
    provider: AIProvider,
    config: Partial<AIConfig> = {}
  ): Promise<ConnectionResult> {
    // Check if already connected
    if (this.connections.has(provider)) {
      const existing = this.connections.get(provider)!;
      if (existing.health === 'healthy') {
        return existing.status; // Already connected
      }
    }

    try {
      // Get existing token for provider if available
      const apiKey = await tokenManager.getTokenByProvider(provider);
      const fullConfig: AIConfig = {
        provider,
        baseUrl: config.baseUrl,
        apiKey: config.apiKey || apiKey || undefined,
        model: config.model,
        timeout: config.timeout || 30000,
        debug: config.debug || false
      };

      // Create adapter instance
      const factory = this.adapterFactories.get(provider);
      if (!factory) {
        return {
          success: false,
          message: `No adapter available for ${provider}`
        };
      }

      const adapter = factory.create(fullConfig);
      const result = await adapter.connect(fullConfig);

      if (result.success) {
        // Store connection
        this.connections.set(provider, {
          provider,
          adapter,
          config: fullConfig,
          status: result,
          connectedAt: new Date(),
          lastActivity: new Date(),
          health: 'healthy'
        });
      }

      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        message: `Connection failed: ${errorMsg}`,
        error: errorMsg
      };
    }
  }

  /**
   * Disconnect from an AI assistant
   */
  async disconnect(provider: AIProvider): Promise<void> {
    const connection = this.connections.get(provider);
    if (connection) {
      try {
        await connection.adapter.disconnect();
      } catch (error) {
        // Ignore disconnect errors
      }
      this.connections.delete(provider);
    }
  }

  /**
   * Get connection status for an AI assistant
   */
  async getConnectionStatus(provider: AIProvider): Promise<ConnectionStatus | null> {
    const connection = this.connections.get(provider);
    if (!connection) {
      return null;
    }

    try {
      const status = await connection.adapter.getConnectionStatus();
      return status;
    } catch (error) {
      return {
        provider,
        connected: false,
        health: 'unreachable',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get status for all connections
   */
  async getAllConnectionStatuses(): Promise<ConnectionStatus[]> {
    const statuses: ConnectionStatus[] = [];

    for (const provider of this.getSupportedProviders()) {
      const status = await this.getConnectionStatus(provider);
      if (status) {
        statuses.push(status);
      }
    }

    return statuses;
  }

  /**
   * Send spec to connected AI assistant
   */
  async sendSpecToProvider(provider: AIProvider, spec: any): Promise<any> {
    const connection = this.connections.get(provider);
    if (!connection) {
      throw new AIConnectionError(`Not connected to ${provider}`, provider);
    }

    try {
      connection.lastActivity = new Date();
      return await connection.adapter.sendSpec(spec);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to send spec to ${provider}: ${errorMsg}`);
    }
  }

  /**
   * Get supported AI providers
   */
  getSupportedProviders(): AIProvider[] {
    return Array.from(this.adapterFactories.keys());
  }

  /**
   * Check if a provider is currently connected
   */
  isConnected(provider: AIProvider): boolean {
    const connection = this.connections.get(provider);
    return Boolean(connection && connection.health === 'healthy');
  }

  /**
   * Get active connections count
   */
  getActiveConnectionsCount(): number {
    let count = 0;
    for (const [provider, connection] of this.connections) {
      if (connection.health === 'healthy') {
        count++;
      }
    }
    return count;
  }

  /**
   * Cleanup on process exit
   */
  async cleanup(): Promise<void> {
    await Promise.all(
      Array.from(this.connections.keys()).map(provider =>
        this.disconnect(provider)
      )
    );
  }
}

// Export singleton instance
export const connectionManager = ConnectionManager.getInstance();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down AI connections...');
  await connectionManager.cleanup();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nTerminating AI connections...');
  await connectionManager.cleanup();
  process.exit(0);
});