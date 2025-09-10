/**
 * Cursor IDE Integration
 *
 * This module provides integration with the Cursor VS Code extension
 * by creating context files that Cursor can read and use for AI assistance.
 */
import { IDEIntegration, IDEIntegrationConfig, IDEContext } from './IDEIntegrationInterface';
import { VibeSpec } from '../spec-parser';
/**
 * Cursor IDE Integration
 *
 * Cursor can read context from special files in the project.
 * This integration creates those files with VibeSpec information.
 */
export declare class CursorIDEIntegration extends IDEIntegration {
    private contextFilePath;
    private watchInterval;
    constructor(config: IDEIntegrationConfig);
    /**
     * Initialize Cursor IDE integration
     */
    initialize(): Promise<void>;
    /**
     * Create context for Cursor
     */
    createContext(spec: VibeSpec): Promise<IDEContext>;
    /**
     * Write context to Cursor-specific files
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
     * Start watching for file changes
     */
    private startWatching;
    /**
     * Get recently modified files
     */
    private getRecentFiles;
    /**
     * Generate markdown content for Cursor context
     */
    private generateContextMarkdown;
}
