"use strict";
/**
 * Spec snapshot and versioning management
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSnapshotManager = exports.SnapshotManager = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const spec_parser_1 = require("./spec-parser");
const cli_1 = require("./cli");
class SnapshotManager {
    constructor(projectRoot, specPath = 'spec.yaml') {
        this.snapshotsDir = path.join(projectRoot, '.vibespec', 'snapshots');
        this.specPath = specPath;
    }
    /**
     * Initialize snapshots directory
     */
    async initialize() {
        await fs.ensureDir(this.snapshotsDir);
        (0, cli_1.debug)('Snapshot manager initialized');
    }
    /**
     * Create a new snapshot of current spec
     */
    async createSnapshot(version, description) {
        try {
            // Validate spec exists and is valid
            const exists = await fs.pathExists(this.specPath);
            if (!exists) {
                (0, cli_1.cliError)(`Spec file not found: ${this.specPath}`);
                process.exit(1);
            }
            const spec = await (0, spec_parser_1.loadSpec)(this.specPath);
            const validation = (0, spec_parser_1.validateSpec)(spec);
            if (!validation.valid) {
                (0, cli_1.cliError)('Cannot create snapshot - spec has validation errors:');
                validation.errors.forEach(error => console.log(`  • ${error}`));
                process.exit(1);
            }
            // Generate snapshot metadata
            const timestamp = new Date().toISOString();
            const hash = this.generateHash(spec);
            const fileName = `${version}-${timestamp.slice(0, 19).replace(/:/g, '-')}.yaml`;
            const snapshot = {
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
            (0, cli_1.success)(`Created snapshot: ${version} (${fileName})`);
            if (description) {
                (0, cli_1.info)(`Description: ${description}`);
            }
            return snapshot;
        }
        catch (err) {
            (0, cli_1.cliError)(`Failed to create snapshot: ${err.message}`);
            process.exit(1);
        }
    }
    /**
     * List all snapshots
     */
    async listSnapshots() {
        try {
            await fs.ensureDir(this.snapshotsDir);
            const files = await fs.readdir(this.snapshotsDir);
            const snapshots = [];
            for (const file of files) {
                if (!file.startsWith('.')) {
                    try {
                        const snapshot = await this.loadSnapshotMetadata(file);
                        if (snapshot) {
                            snapshots.push(snapshot);
                        }
                    }
                    catch (err) {
                        (0, cli_1.debug)(`Failed to load metadata for ${file}: ${err.message}`);
                    }
                }
            }
            // Sort by timestamp (newest first)
            snapshots.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            return snapshots;
        }
        catch (err) {
            (0, cli_1.cliError)(`Failed to list snapshots: ${err.message}`);
            return [];
        }
    }
    /**
     * Restore spec from a snapshot
     */
    async restoreSnapshot(version) {
        try {
            const snapshots = await this.listSnapshots();
            const snapshot = snapshots.find(s => s.version === version || s.fileName.includes(version));
            if (!snapshot) {
                (0, cli_1.cliError)(`Snapshot not found: ${version}`);
                (0, cli_1.info)('Available snapshots:');
                snapshots.forEach(snap => {
                    console.log(`  • ${snap.version} - ${snap.fileName}`);
                });
                process.exit(1);
            }
            const snapshotPath = path.join(this.snapshotsDir, snapshot.fileName);
            const snapshotContent = await fs.readFile(snapshotPath, 'utf-8');
            // Extract original spec content (remove metadata lines)
            const lines = snapshotContent.split('\n');
            const specLines = lines.filter(line => !line.startsWith('# Snapshot:') &&
                !line.startsWith('# Timestamp:') &&
                !line.startsWith('# Description:'));
            const originalContent = specLines.join('\n');
            // Backup current spec if it exists
            const currentExists = await fs.pathExists(this.specPath);
            if (currentExists) {
                await fs.move(this.specPath, `${this.specPath}.backup-${Date.now()}`);
                (0, cli_1.info)(`Backed up current spec to: ${this.specPath}.backup-${Date.now()}`);
            }
            // Restore snapshot
            await fs.writeFile(this.specPath, originalContent);
            (0, cli_1.success)(`Restored spec to version: ${snapshot.version}`);
            if (snapshot.description) {
                (0, cli_1.info)(`Description: ${snapshot.description}`);
            }
            (0, cli_1.info)(`From snapshot: ${snapshot.fileName}`);
        }
        catch (err) {
            (0, cli_1.cliError)(`Failed to restore snapshot: ${err.message}`);
            process.exit(1);
        }
    }
    /**
     * Show snapshot details
     */
    async showSnapshot(version) {
        try {
            const snapshots = await this.listSnapshots();
            const snapshot = snapshots.find(s => s.version === version || s.fileName.includes(version));
            if (!snapshot) {
                (0, cli_1.cliError)(`Snapshot not found: ${version}`);
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
        }
        catch (err) {
            (0, cli_1.cliError)(`Failed to show snapshot: ${err.message}`);
            process.exit(1);
        }
    }
    /**
     * Delete a snapshot
     */
    async deleteSnapshot(version) {
        try {
            const snapshots = await this.listSnapshots();
            const snapshot = snapshots.find(s => s.version === version || s.fileName.includes(version));
            if (!snapshot) {
                (0, cli_1.cliError)(`Snapshot not found: ${version}`);
                process.exit(1);
            }
            const snapshotPath = path.join(this.snapshotsDir, snapshot.fileName);
            const metadataPath = path.join(this.snapshotsDir, `${snapshot.version}.json`);
            // Delete files
            await fs.remove(snapshotPath).catch(() => { });
            await fs.remove(metadataPath).catch(() => { });
            (0, cli_1.success)(`Deleted snapshot: ${snapshot.version}`);
        }
        catch (err) {
            (0, cli_1.cliError)(`Failed to delete snapshot: ${err.message}`);
            process.exit(1);
        }
    }
    /**
     * Generate hash for spec content
     */
    generateHash(spec) {
        const crypto = require('crypto');
        const content = JSON.stringify(spec, Object.keys(spec).sort());
        return crypto.createHash('sha256').update(content).digest('hex').substring(0, 8);
    }
    /**
     * Save snapshot metadata
     */
    async saveSnapshotMetadata(snapshot) {
        const metadataPath = path.join(this.snapshotsDir, `${snapshot.version}.json`);
        const metadata = {
            ...snapshot,
            specData: undefined // Don't save full spec in metadata
        };
        await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
    }
    /**
     * Load snapshot metadata
     */
    async loadSnapshotMetadata(fileName) {
        try {
            const baseName = path.basename(fileName, '.yaml');
            const version = baseName.split('-').slice(0, 1)[0];
            const metadataPath = path.join(this.snapshotsDir, `${baseName}.json`);
            const metadataContent = await fs.readFile(metadataPath, 'utf-8');
            return JSON.parse(metadataContent);
        }
        catch {
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
exports.SnapshotManager = SnapshotManager;
// Export singleton for easier use
const createSnapshotManager = (projectRoot, specPath) => new SnapshotManager(projectRoot, specPath);
exports.createSnapshotManager = createSnapshotManager;
