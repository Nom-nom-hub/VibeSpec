import { BaseAdapter } from './BaseAdapter';
import { AIConfig, ConnectionResult, SendResult } from './AdapterInterface';
import { VibeSpec } from '../../spec-parser';
/**
 * CLI Wrapper Adapter
 *
 * This adapter provides a generic wrapper for CLI-based AI models that can be
 * run from the command line. It works with models like StarCoder, CodeGeeX, etc.
 */
export declare class CLIWrapperAdapter extends BaseAdapter {
    private tempDir;
    private modelName;
    constructor(config: AIConfig);
    /**
     * Establish connection to CLI-based AI model
     */
    connect(config: AIConfig): Promise<ConnectionResult>;
    /**
     * Check if the CLI tool is installed and accessible
     */
    private checkCLIInstallation;
    /**
     * Send specification to CLI-based AI model
     */
    sendSpec(spec: VibeSpec, options?: {
        optimize?: boolean;
        format?: string;
    }): Promise<SendResult>;
    /**
     * Run the CLI tool with a prompt file
     */
    private runCLI;
    /**
     * Generate a prompt for the AI model based on the spec
     */
    private generatePrompt;
}
