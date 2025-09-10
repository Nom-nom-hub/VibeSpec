import {
  AIAssistant,
  AIProvider,
  AIConfig,
  ConnectionResult,
  ConnectionStatus,
  SendResult,
  SpecUpdate,
  AIImprovement,
  CodeSuggestion,
  SyncOptions,
  SyncStatus
} from './AdapterInterface';
import { VibeSpec } from '../../spec-parser';

/**
 * Base adapter class implementing common functionality for all AI assistants
 * This provides default implementations that can be overridden by specific adapters
 */
export abstract class BaseAdapter implements AIAssistant {
  public readonly provider: AIProvider;
  protected config: AIConfig;
  protected connected: boolean = false;
  protected lastActivity: Date | null = null;
  protected health: 'healthy' | 'degraded' | 'unreachable' = 'unreachable';

  constructor(provider: AIProvider, config: AIConfig) {
    this.provider = provider;
    this.config = config;
  }

  /**
   * Establish connection to the AI assistant
   */
  abstract connect(config: AIConfig): Promise<ConnectionResult>;

  /**
   * Terminate the connection to the AI assistant
   */
  async disconnect(): Promise<void> {
    this.connected = false;
    this.health = 'unreachable';
    this.lastActivity = new Date();
  }

  /**
   * Check if the connection is active and healthy
   */
  async isConnected(): Promise<boolean> {
    return this.connected;
  }

  /**
   * Get detailed connection status
   */
  async getConnectionStatus(): Promise<ConnectionStatus> {
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
   * Send current specification to AI assistant
   */
  abstract sendSpec(spec: VibeSpec, options?: { optimize?: boolean; format?: string }): Promise<SendResult>;

  /**
   * Send a specification update/revision to the AI
   */
  async sendUpdate(update: SpecUpdate): Promise<void> {
    if (!this.connected) {
      throw new Error(`Not connected to ${this.provider}`);
    }
    this.lastActivity = new Date();
    // Default implementation - to be overridden by specific adapters
  }

  /**
   * Generate optimized context for AI consumption
   */
  async generateContext(spec: VibeSpec): Promise<{
    summary: string;
    keyRequirements: string[];
    implementationOrder: string[];
    potentialChallenges: string[];
  }> {
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
  async requestRefinement(spec: VibeSpec, focus?: string[]): Promise<AIImprovement[]> {
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
  async requestImplementation(spec: VibeSpec): Promise<CodeSuggestion[]> {
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
  async suggestTemplate(requirements: string[]): Promise<Array<{
    templateType: string;
    confidence: number;
    reasoning: string;
    suitability: 'excellent' | 'good' | 'fair';
  }>> {
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
  async startSync(specId: string, options: SyncOptions): Promise<void> {
    if (!this.connected) {
      throw new Error(`Not connected to ${this.provider}`);
    }
    this.lastActivity = new Date();
    // Default implementation - to be overridden by specific adapters
  }

  /**
   * Stop real-time synchronization
   */
  async stopSync(specId: string): Promise<void> {
    this.lastActivity = new Date();
    // Default implementation - to be overridden by specific adapters
  }

  /**
   * Get current synchronization status
   */
  async getSyncStatus(specId: string): Promise<SyncStatus> {
    return {
      active: false,
      pendingChanges: 0,
      conflicts: 0
    };
  }

  /**
   * Pause synchronization temporarily
   */
  async pauseSync(specId: string): Promise<void> {
    this.lastActivity = new Date();
  }

  /**
   * Resume synchronization
   */
  async resumeSync(specId: string): Promise<void> {
    this.lastActivity = new Date();
  }

  /**
   * Validate connection configuration
   */
  validateConfig(config: AIConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
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
  async getSupportedFeatures(): Promise<string[]> {
    return [];
  }

  /**
   * Get usage/attribution information
   */
  async getUsageInfo(): Promise<{
    requestsUsed?: number;
    quotaRemaining?: number;
    resetDate?: Date;
    costsIncurred?: number;
  }> {
    return {};
  }

  /**
   * Cleanup resources (called on process exit)
   */
  async cleanup(): Promise<void> {
    await this.disconnect();
  }
}