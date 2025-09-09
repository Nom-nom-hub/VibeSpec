/**
 * Spec snapshot and versioning management
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { loadSpec, validateSpec } from './spec-parser';
import { success, cliError, info, debug } from './cli';

export interface SpecSnapshot {
  version: string;
  timestamp: string;
  hash: string;
  fileName: string;
  description?: string;
  specData?: any;
}

export class SnapshotManager {
  private snapshotsDir: string;
  private specPath: string;

  constructor(projectRoot: string, specPath: string = 'spec.yaml') {
    this.snapshotsDir = path.join(projectRoot, '.vibespec', 'snapshots');
    this.specPath = specPath;
  }

  /**
   * Initialize snapshots directory
   */
  async initialize(): Promise<void> {
    await fs.ensureDir(this.snapshotsDir);
    debug('Snapshot manager initialized');
  }

  /**
   * Create a new snapshot of current spec
   */
  async createSnapshot(
    version: string,
    description?: string
  ): Promise<SpecSnapshot> {
    try {
      // Validate spec exists and is valid
      const exists = await fs.pathExists(this.specPath);
      if (!exists) {
        cliError(`Spec file not found: ${this.specPath}`);
        process.exit(1);
      }

      const spec = await loadSpec(this.specPath);
      const validation = validateSpec(spec);

      if (!validation.valid) {
        cliError('Cannot create snapshot - spec has validation errors:');
        validation.errors.forEach(error => console.log(`  • ${error}`));
        process.exit(1);
      }

      // Generate snapshot metadata
      const timestamp = new Date().toISOString();
      const hash = this.generateHash(spec);
      const fileName = `${version}-${timestamp.slice(0, 19).replace(/:/g, '-')}.yaml`;

      const snapshot: SpecSnapshot = {
        version,
        timestamp,
        hash,
        fileName,
        description,
        specData: spec
      };

      // Save snapshot
      const snapshotPath = path.join(this.snapshotsDir, fileName);
      const originalContent = await fs.readFile(this.specPath, 'utf-8');
      await fs.writeFile(snapshotPath, `# Snapshot: ${version}\n# Timestamp: ${timestamp}\n# Description: ${description || 'No description'}\n\n${originalContent}`);

      // Save metadata
      await this.saveSnapshotMetadata(snapshot);

      success(`Created snapshot: ${version} (${fileName})`);
      if (description) {
        info(`Description: ${description}`);
      }

      return snapshot;

    } catch (err) {
      cliError(`Failed to create snapshot: ${(err as Error).message}`);
      process.exit(1);
    }
  }

  /**
   * List all snapshots
   */
  async listSnapshots(): Promise<SpecSnapshot[]> {
    try {
      await fs.ensureDir(this.snapshotsDir);
      const files = await fs.readdir(this.snapshotsDir);

      const snapshots: SpecSnapshot[] = [];

      for (const file of files) {
        if (!file.startsWith('.')) {
          try {
            const snapshot = await this.loadSnapshotMetadata(file);
            if (snapshot) {
              snapshots.push(snapshot);
            }
          } catch (err) {
            debug(`Failed to load metadata for ${file}: ${(err as Error).message}`);
          }
        }
      }

      // Sort by timestamp (newest first)
      snapshots.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      return snapshots;

    } catch (err) {
      cliError(`Failed to list snapshots: ${(err as Error).message}`);
      return [];
    }
  }

  /**
   * Restore spec from a snapshot
   */
  async restoreSnapshot(version: string): Promise<void> {
    try {
      const snapshots = await this.listSnapshots();
      const snapshot = snapshots.find(s => s.version === version || s.fileName.includes(version));

      if (!snapshot) {
        cliError(`Snapshot not found: ${version}`);
        info('Available snapshots:');
        snapshots.forEach(snap => {
          console.log(`  • ${snap.version} - ${snap.fileName}`);
        });
        process.exit(1);
      }

      const snapshotPath = path.join(this.snapshotsDir, snapshot.fileName);
      const snapshotContent = await fs.readFile(snapshotPath, 'utf-8');

      // Extract original spec content (remove metadata lines)
      const lines = snapshotContent.split('\n');
      const specLines = lines.filter(line =>
        !line.startsWith('# Snapshot:') &&
        !line.startsWith('# Timestamp:') &&
        !line.startsWith('# Description:')
      );
      const originalContent = specLines.join('\n');

      // Backup current spec if it exists
      const currentExists = await fs.pathExists(this.specPath);
      if (currentExists) {
        await fs.move(this.specPath, `${this.specPath}.backup-${Date.now()}`);
        info(`Backed up current spec to: ${this.specPath}.backup-${Date.now()}`);
      }

      // Restore snapshot
      await fs.writeFile(this.specPath, originalContent);

      success(`Restored spec to version: ${snapshot.version}`);
      if (snapshot.description) {
        info(`Description: ${snapshot.description}`);
      }
      info(`From snapshot: ${snapshot.fileName}`);

    } catch (err) {
      cliError(`Failed to restore snapshot: ${(err as Error).message}`);
      process.exit(1);
    }
  }

  /**
   * Show snapshot details
   */
  async showSnapshot(version: string): Promise<void> {
    try {
      const snapshots = await this.listSnapshots();
      const snapshot = snapshots.find(s => s.version === version || s.fileName.includes(version));

      if (!snapshot) {
        cliError(`Snapshot not found: ${version}`);
        process.exit(1);
      }

      console.log(`📸 Snapshot Details: ${snapshot.version}`);
      console.log(`   File: ${snapshot.fileName}`);
      console.log(`   Timestamp: ${new Date(snapshot.timestamp).toLocaleString()}`);
      console.log(`   Hash: ${snapshot.hash}`);
      if (snapshot.description) {
        console.log(`   Description: ${snapshot.description}`);
      }

      // Validate snapshot
      const snapshotPath = path.join(this.snapshotsDir, snapshot.fileName);
      const exists = await fs.pathExists(snapshotPath);
      console.log(`   Valid: ${exists ? 'Yes' : 'No'}`);

      // Show spec summary if available
      if (snapshot.specData) {
        const spec = snapshot.specData;
        console.log(`   Project: ${spec.project}`);
        console.log(`   Features: ${spec.features?.length || 0}`);
        console.log(`   Goals: ${spec.goals?.length || 0}`);
      }

    } catch (err) {
      cliError(`Failed to show snapshot: ${(err as Error).message}`);
      process.exit(1);
    }
  }

  /**
   * Delete a snapshot
   */
  async deleteSnapshot(version: string): Promise<void> {
    try {
      const snapshots = await this.listSnapshots();
      const snapshot = snapshots.find(s => s.version === version || s.fileName.includes(version));

      if (!snapshot) {
        cliError(`Snapshot not found: ${version}`);
        process.exit(1);
      }

      const snapshotPath = path.join(this.snapshotsDir, snapshot.fileName);
      const metadataPath = path.join(this.snapshotsDir, `${snapshot.version}.json`);

      // Delete files
      await fs.remove(snapshotPath).catch(() => {});
      await fs.remove(metadataPath).catch(() => {});

      success(`Deleted snapshot: ${snapshot.version}`);

    } catch (err) {
      cliError(`Failed to delete snapshot: ${(err as Error).message}`);
      process.exit(1);
    }
  }

  /**
   * Generate hash for spec content
   */
  private generateHash(spec: any): string {
    const crypto = require('crypto');
    const content = JSON.stringify(spec, Object.keys(spec).sort());
    return crypto.createHash('sha256').update(content).digest('hex').substring(0, 8);
  }

  /**
   * Save snapshot metadata
   */
  private async saveSnapshotMetadata(snapshot: SpecSnapshot): Promise<void> {
    const metadataPath = path.join(this.snapshotsDir, `${snapshot.version}.json`);
    const metadata = {
      ...snapshot,
      specData: undefined  // Don't save full spec in metadata
    };
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
  }

  /**
   * Load snapshot metadata
   */
  private async loadSnapshotMetadata(fileName: string): Promise<SpecSnapshot | null> {
    try {
      const baseName = path.basename(fileName, '.yaml');
      const version = baseName.split('-').slice(0, 1)[0];
      const metadataPath = path.join(this.snapshotsDir, `${baseName}.json`);

      const metadataContent = await fs.readFile(metadataPath, 'utf-8');
      return JSON.parse(metadataContent);
    } catch {
      // Try to infer from filename
      const version = path.basename(fileName, '.yaml').split('-')[0];
      return {
        version,
        timestamp: new Date().toISOString(),
        hash: 'unknown',
        fileName,
        description: 'Imported from filename'
      };
    }
  }
}

// Export singleton for easier use
export const createSnapshotManager = (projectRoot: string, specPath?: string) =>
  new SnapshotManager(projectRoot, specPath);