import { BaseAdapter } from './BaseAdapter';
import { AIConfig, ConnectionResult, SendResult } from './AdapterInterface';
import { VibeSpec } from '../../spec-parser';
/**
 * Cursor AI Adapter
 *
 * This adapter provides integration with Cursor AI, a VS Code extension that offers
 * real-time AI assistance for coding. Since Cursor runs locally within VS Code,
 * no API key is required.
 */
export declare class CursorAdapter extends BaseAdapter {
    constructor(config: AIConfig);
    /**
     * Establish connection to Cursor AI
     */
    connect(config: AIConfig): Promise<ConnectionResult>;
    /**
     * Check if Cursor is installed and accessible
     */
    private checkCursorInstallation;
    /**
     * Send specification to Cursor AI
     */
    sendSpec(spec: VibeSpec, options?: {
        optimize?: boolean;
        format?: string;
    }): Promise<SendResult>;
}
