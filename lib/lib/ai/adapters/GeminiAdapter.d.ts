import { BaseAdapter } from './BaseAdapter';
import { AIConfig, ConnectionResult, SendResult } from './AdapterInterface';
import { VibeSpec } from '../../spec-parser';
/**
 * Gemini Adapter
 *
 * This adapter provides integration with Google's Gemini AI models.
 * Gemini requires an API key for authentication.
 */
export declare class GeminiAdapter extends BaseAdapter {
    constructor(config: AIConfig);
    /**
     * Establish connection to Gemini
     */
    connect(config: AIConfig): Promise<ConnectionResult>;
    /**
     * Send specification to Gemini
     */
    sendSpec(spec: VibeSpec, options?: {
        optimize?: boolean;
        format?: string;
    }): Promise<SendResult>;
}
