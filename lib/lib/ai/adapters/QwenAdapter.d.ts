import { BaseAdapter } from './BaseAdapter';
import { AIConfig, ConnectionResult, SendResult } from './AdapterInterface';
import { VibeSpec } from '../../spec-parser';
/**
 * Qwen Code Adapter
 *
 * This adapter provides integration with Qwen Code, the interactive coding assistant
 * that you are currently using. This adapter works within the Qwen Code environment.
 */
export declare class QwenAdapter extends BaseAdapter {
    constructor(config: AIConfig);
    /**
     * Establish connection to Qwen Code
     */
    connect(config: AIConfig): Promise<ConnectionResult>;
    /**
     * Send specification to Qwen Code
     */
    sendSpec(spec: VibeSpec, options?: {
        optimize?: boolean;
        format?: string;
    }): Promise<SendResult>;
}
