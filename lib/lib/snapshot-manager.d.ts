/**
 * Spec snapshot and versioning management
 */
export interface SpecSnapshot {
    version: string;
    timestamp: string;
    hash: string;
    fileName: string;
    description?: string;
    specData?: any;
}
export declare class SnapshotManager {
    private snapshotsDir;
    private specPath;
    constructor(projectRoot: string, specPath?: string);
    /**
     * Initialize snapshots directory
     */
    initialize(): Promise<void>;
    /**
     * Create a new snapshot of current spec
     */
    createSnapshot(version: string, description?: string): Promise<SpecSnapshot>;
    /**
     * List all snapshots
     */
    listSnapshots(): Promise<SpecSnapshot[]>;
    /**
     * Restore spec from a snapshot
     */
    restoreSnapshot(version: string): Promise<void>;
    /**
     * Show snapshot details
     */
    showSnapshot(version: string): Promise<void>;
    /**
     * Delete a snapshot
     */
    deleteSnapshot(version: string): Promise<void>;
    /**
     * Generate hash for spec content
     */
    private generateHash;
    /**
     * Save snapshot metadata
     */
    private saveSnapshotMetadata;
    /**
     * Load snapshot metadata
     */
    private loadSnapshotMetadata;
}
export declare const createSnapshotManager: (projectRoot: string, specPath?: string) => SnapshotManager;
