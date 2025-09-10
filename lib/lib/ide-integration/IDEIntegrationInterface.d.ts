/**
 * IDE Integration Interface
 *
 * This module provides integration with AI coding IDEs and extensions
 * by creating context files and communicating through the file system.
 */
import { VibeSpec } from '../spec-parser';
export interface IDEIntegrationConfig {
    /** Path to the project root directory */
    projectRoot: string;
    /** Path to the IDE context directory */
    contextDir?: string;
    /** Whether to create context files automatically */
    autoCreateContext?: boolean;
    /** Whether to watch for file changes */
    watchChanges?: boolean;
}
export interface IDEContext {
    /** Project information */
    project: {
        name: string;
        version?: string;
        description?: string;
    };
    /** Goals and objectives */
    goals: string[];
    /** Constraints and limitations */
    constraints: string[];
    /** Features with requirements */
    features: Array<{
        name: string;
        description?: string;
        requirements: string[];
        flows?: Array<{
            name: string;
            description?: string;
            steps: string[];
        }>;
    }>;
    /** Implementation context */
    implementation: {
        /** Current working directory */
        cwd: string;
        /** Recently modified files */
        recentFiles: string[];
        /** Current focus area */
        focus?: string;
    };
    /** AI-specific instructions */
    aiInstructions?: {
        /** General guidelines */
        guidelines?: string[];
        /** Do's and don'ts */
        doNotDo?: {
            do: string[];
            dont: string[];
        };
        /** Preferred patterns */
        patterns?: string[];
    };
}
/**
 * Base class for IDE integration
 */
export declare abstract class IDEIntegration {
    protected config: IDEIntegrationConfig;
    protected context: IDEContext | null;
    constructor(config: IDEIntegrationConfig);
    /**
     * Initialize IDE integration
     */
    abstract initialize(): Promise<void>;
    /**
     * Create context for AI assistants
     */
    abstract createContext(spec: VibeSpec): Promise<IDEContext>;
    /**
     * Write context to IDE-specific files
     */
    abstract writeContext(context: IDEContext): Promise<void>;
    /**
     * Update context with changes
     */
    abstract updateContext(changes: Partial<IDEContext>): Promise<void>;
    /**
     * Cleanup resources
     */
    abstract cleanup(): Promise<void>;
    /**
     * Get the context directory path
     */
    protected getContextDir(): string;
    /**
     * Ensure context directory exists
     */
    protected ensureContextDir(): Promise<string>;
}
