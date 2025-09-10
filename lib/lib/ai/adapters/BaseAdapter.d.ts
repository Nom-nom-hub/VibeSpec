import { AIAssistant, AIProvider, AIConfig, ConnectionResult, ConnectionStatus, SendResult, SpecUpdate, AIImprovement, CodeSuggestion, SyncOptions, SyncStatus } from './AdapterInterface';
import { VibeSpec } from '../../spec-parser';
/**
 * Base adapter class implementing common functionality for all AI assistants
 * This provides default implementations that can be overridden by specific adapters
 */
export declare abstract class BaseAdapter implements AIAssistant {
    readonly provider: AIProvider;
    protected config: AIConfig;
    protected connected: boolean;
    protected lastActivity: Date | null;
    protected health: 'healthy' | 'degraded' | 'unreachable';
    constructor(provider: AIProvider, config: AIConfig);
    /**
     * Establish connection to the AI assistant
     */
    abstract connect(config: AIConfig): Promise<ConnectionResult>;
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
    /**
     * Send current specification to AI assistant
     */
    abstract sendSpec(spec: VibeSpec, options?: {
        optimize?: boolean;
        format?: string;
    }): Promise<SendResult>;
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
    /**
     * Validate connection configuration
     */
    validateConfig(config: AIConfig): {
        valid: boolean;
        errors: string[];
    };
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
