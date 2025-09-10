/**
 * GitHub Copilot IDE Integration
 *
 * This module provides integration with GitHub Copilot by creating
 * context files and using GitHub's context mechanisms.
 */
import { IDEIntegration, IDEIntegrationConfig, IDEContext } from './IDEIntegrationInterface';
import { VibeSpec } from '../spec-parser';
/**
 * GitHub Copilot IDE Integration
 *
 * Copilot can use context from special files and GitHub's context system.
 * This integration creates those files with VibeSpec information.
 */
export declare class CopilotIDEIntegration extends IDEIntegration {
    private contextFiles;
    constructor(config: IDEIntegrationConfig);
    /**
     * Initialize Copilot IDE integration
     */
    initialize(): Promise<void>;
    /**
     * Create context for Copilot
     */
    createContext(spec: VibeSpec): Promise<IDEContext>;
    /**
     * Write context to Copilot-specific files
     */
    writeContext(context: IDEContext): Promise<void>;
    /**
     * Update context with changes
     */
    updateContext(changes: Partial<IDEContext>): Promise<void>;
    /**
     * Cleanup resources
     */
    cleanup(): Promise<void>;
    /**
     * Generate markdown content for Copilot context
     */
    private generateMarkdownContext;
    /**
     * Generate instructions for Copilot
     */
    private generateInstructions;
}
