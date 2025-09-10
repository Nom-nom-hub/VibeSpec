import { BaseAdapter } from './BaseAdapter';
import { AIConfig, ConnectionResult, SendResult } from './AdapterInterface';
import { VibeSpec } from '../../spec-parser';
/**
 * GitHub Copilot Adapter
 *
 * This adapter provides integration with GitHub Copilot, an AI pair programmer
 * that helps you write code faster. Copilot typically uses GitHub authentication,
 * so an API key is optional but can be provided for enterprise environments.
 */
export declare class CopilotAdapter extends BaseAdapter {
    constructor(config: AIConfig);
    /**
     * Establish connection to GitHub Copilot
     */
    connect(config: AIConfig): Promise<ConnectionResult>;
    /**
     * Check if Copilot is authenticated through GitHub
     */
    private checkCopilotAuthentication;
    /**
     * Send specification to GitHub Copilot
     */
    sendSpec(spec: VibeSpec, options?: {
        optimize?: boolean;
        format?: string;
    }): Promise<SendResult>;
}
