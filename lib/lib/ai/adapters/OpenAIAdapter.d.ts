import { BaseAdapter } from './BaseAdapter';
import { AIConfig, ConnectionResult, SendResult } from './AdapterInterface';
import { VibeSpec } from '../../spec-parser';
/**
 * OpenAI Codex Adapter
 *
 * This adapter provides integration with OpenAI's Codex API for code generation
 * and AI-assisted programming.
 */
export declare class OpenAIAdapter extends BaseAdapter {
    private axiosInstance;
    private apiKey;
    private baseUrl;
    private model;
    private rateLimitResetTime;
    constructor(config: AIConfig);
    /**
     * Establish connection to OpenAI Codex
     */
    connect(config: AIConfig): Promise<ConnectionResult>;
    /**
     * Send specification to OpenAI Codex
     */
    sendSpec(spec: VibeSpec, options?: {
        optimize?: boolean;
        format?: string;
    }): Promise<SendResult>;
    /**
     * Generate a prompt for OpenAI based on the spec
     */
    private generatePrompt;
}
