import { BaseAdapter } from './BaseAdapter';
import { AIConfig, ConnectionResult, SendResult } from './AdapterInterface';
import { VibeSpec } from '../../spec-parser';
/**
 * Ollama Adapter
 *
 * This adapter provides integration with Ollama, a tool for running large language
 * models locally. Since Ollama runs locally, no API key is required.
 */
export declare class OllamaAdapter extends BaseAdapter {
    constructor(config: AIConfig);
    /**
     * Establish connection to Ollama
     */
    connect(config: AIConfig): Promise<ConnectionResult>;
    /**
     * Check if Ollama is installed and accessible
     */
    private checkOllamaInstallation;
    /**
     * Send specification to Ollama
     */
    sendSpec(spec: VibeSpec, options?: {
        optimize?: boolean;
        format?: string;
    }): Promise<SendResult>;
}
