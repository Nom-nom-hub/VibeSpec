/**
 * Universal AI Assistant Adapter Interface
 *
 * This interface defines the universal contract that all AI assistant adapters must implement.
 * It provides a consistent API for connecting to and communicating with different AI assistants.
 */

// Generic imports we need for AI integration
import { VibeSpec } from '../../spec-parser';

// Connection types
export type AIProvider = 'cursor' | 'copilot' | 'claude' | 'ollama' | 'gemini' | 'qwen' | 'openai' | 'starcoder' | 'codegeex' | 'codet5' | 'polycoder' | 'mpt-code' | 'a-code';

export interface AIConfig {
  provider: AIProvider;
  baseUrl?: string;
  apiKey?: string;
  token?: string; // For providers that use tokens
  model?: string;
  timeout?: number;
  retry?: {
    count: number;
    delay: number;
  };
  debug?: boolean;
}

// Connection results and status
export interface ConnectionResult {
  success: boolean;
  message: string;
  credentials?: {
    provider: AIProvider;
    scopes?: string[];
    expiresAt?: Date;
  };
  error?: string;
}

export interface ConnectionStatus {
  provider: AIProvider;
  connected: boolean;
  lastActivity?: Date;
  health: 'healthy' | 'degraded' | 'unreachable';
  version?: string;
  features?: string[];
  error?: string;
}

// Spec transmission and analysis
export interface SendResult {
  success: boolean;
  messageId?: string;
  estimatedTokens?: number;
  processingTime?: number;
  error?: string;
  warnings?: string[];
}

export interface SpecUpdate {
  specId: string;
  field: string;
  oldValue: any;
  newValue: any;
  timestamp: Date;
  source: 'user' | 'ai' | 'sync';
}

// AI responses and suggestions
export interface AIImprovement {
  id: string;
  category: 'security' | 'performance' | 'usability' | 'architecture';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  suggestions: string[];
  estimatedImpact?: 'minimal' | 'moderate' | 'significant' | 'major';
  affectedFeatures?: string[];
}

export interface CodeSuggestion {
  file: string;
  line?: number;
  code: string;
  explanation: string;
  startLine?: number;
  endLine?: number;
  language?: string;
}

// Real-time sync and collaboration
export interface SyncOptions {
  bidirectional: boolean;
  autoPush: boolean;
  conflictResolution: 'manual' | 'ai' | 'last-wins';
  updateFrequency: 'immediate' | 'debounced' | 'interval';
  includeComments: boolean;
}

export interface SyncStatus {
  active: boolean;
  lastSync?: Date;
  pendingChanges: number;
  conflicts: number;
  errorMessage?: string;
}

/**
 * Universal AI Assistant Adapter Interface
 *
 * All AI assistant integrations must implement this interface to ensure
 * consistent behavior and API compatibility across different providers.
 */
export interface AIAssistant {
  readonly provider: AIProvider;

  // =============================================================================
  // CONNECTION MANAGEMENT
  // =============================================================================

  /**
   * Establish connection to the AI assistant
   */
  connect(config: AIConfig): Promise<ConnectionResult>;

  /**
   * Terminate the connection to the AI assistant
   */
  disconnect(): Promise<void>;

  /**
   * Check if the connection is active and healthy
   */
  isConnected(): Promise<boolean>;

  /**
   * Get detailed connection status
   */
  getConnectionStatus(): Promise<ConnectionStatus>;

  // =============================================================================
  // SPECIFICATION SHARING
  // =============================================================================

  /**
   * Send current specification to AI assistant
   * @param spec The VibeSpec object to send
   * @param options Transmission options
   */
  sendSpec(spec: VibeSpec, options?: { optimize?: boolean; format?: string }): Promise<SendResult>;

  /**
   * Send a specification update/revision to the AI
   */
  sendUpdate(update: SpecUpdate): Promise<void>;

  /**
   * Generate optimized context for AI consumption
   */
  generateContext(spec: VibeSpec): Promise<{
    summary: string;
    keyRequirements: string[];
    implementationOrder: string[];
    potentialChallenges: string[];
  }>;

  // =============================================================================
  // AI-DRIVEN ANALYSIS AND SUGGESTIONS
  // =============================================================================

  /**
   * Request AI analysis and improvement suggestions for a specification
   */
  requestRefinement(spec: VibeSpec, focus?: string[]): Promise<AIImprovement[]>;

  /**
   * Request AI-generated implementation suggestions
   */
  requestImplementation(spec: VibeSpec): Promise<CodeSuggestion[]>;

  /**
   * Get AI recommendations for template selection
   */
  suggestTemplate(requirements: string[]): Promise<Array<{
    templateType: string;
    confidence: number;
    reasoning: string;
    suitability: 'excellent' | 'good' | 'fair';
  }>>;

  // =============================================================================
  // REAL-TIME COLLABORATION
  // =============================================================================

  /**
   * Start real-time synchronization for a specification
   */
  startSync(specId: string, options: SyncOptions): Promise<void>;

  /**
   * Stop real-time synchronization
   */
  stopSync(specId: string): Promise<void>;

  /**
   * Get current synchronization status
   */
  getSyncStatus(specId: string): Promise<SyncStatus>;

  /**
   * Pause synchronization temporarily
   */
  pauseSync(specId: string): Promise<void>;

  /**
   * Resume synchronization
   */
  resumeSync(specId: string): Promise<void>;

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  /**
   * Validate connection configuration
   */
  validateConfig(config: AIConfig): { valid: boolean; errors: string[] };

  /**
   * Get supported features for this AI provider
   */
  getSupportedFeatures(): Promise<string[]>;

  /**
   * Get usage/attribution information
   */
  getUsageInfo(): Promise<{
    requestsUsed?: number;
    quotaRemaining?: number;
    resetDate?: Date;
    costsIncurred?: number;
  }>;

  /**
   * Cleanup resources (called on process exit)
   */
  cleanup(): Promise<void>;
}

/**
 * Factory interface for creating AI adapters
 */
export interface AIAdapterFactory {
  /**
   * Create an AI adapter instance
   */
  create(config: AIConfig): AIAssistant;

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

// Common error types
export class AIConnectionError extends Error {
  constructor(
    message: string,
    public readonly provider: AIProvider,
    public readonly code?: string,
    public readonly retryable: boolean = true
  ) {
    super(message);
    this.name = 'AIConnectionError';
  }
}

export class AIAuthenticationError extends Error {
  constructor(
    message: string,
    public readonly provider: AIProvider,
    public readonly canRetry: boolean = true
  ) {
    super(message);
    this.name = 'AIAuthenticationError';
  }
}

export class AISyncConflictError extends Error {
  constructor(
    message: string,
    public readonly conflicts: Array<{
      field: string;
      localValue: any;
      remoteValue: any;
    }>
  ) {
    super(message);
    this.name = 'AISyncConflictError';
  }
}

// Event types for real-time updates
export interface AIEvent {
  type: 'connection' | 'sync-update' | 'error' | 'suggestion';
  timestamp: Date;
  data: any;
  specId?: string;
}

// Callback types for event handling
export type ConnectionCallback = (result: ConnectionResult) => void;
export type SyncUpdateCallback = (update: SpecUpdate) => void;
export type ErrorCallback = (error: Error) => void;
export type SuggestionCallback = (suggestion: AIImprovement) => void;