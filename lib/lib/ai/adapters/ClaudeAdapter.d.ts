import { BaseAdapter } from './BaseAdapter';
import { AIConfig, ConnectionResult, SendResult } from './AdapterInterface';
import { VibeSpec } from '../../spec-parser';
/**
 * Claude CLI Adapter
 *
 * This adapter provides integration with Anthropic's Claude AI through API calls.
 * Claude requires an API key for authentication.
 */
export declare class ClaudeAdapter extends BaseAdapter {
    private axiosInstance;
    private apiKey;
    private baseUrl;
    private model;
    private rateLimitResetTime;
    constructor(config: AIConfig);
    /**
     * Establish connection to Claude CLI
     */
    connect(config: AIConfig): Promise<ConnectionResult>;
    /**
     * Send specification to Claude CLI
     */
    sendSpec(spec: VibeSpec, options?: {
        optimize?: boolean;
        format?: string;
    }): Promise<SendResult>;
    /**
     * Generate a prompt for Claude based on the spec
     */
    private generatePrompt;
}
