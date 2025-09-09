"use strict";
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
exports.snapshotCommand = void 0;
const commander_1 = require("commander");
const path = __importStar(require("path"));
const cli_1 = require("../lib/cli");
const snapshot_manager_1 = require("../lib/snapshot-manager");
exports.snapshotCommand = (0, cli_1.createCommand)('snapshot', 'Manage spec snapshots and versioning')
    .addCommand(new commander_1.Command('create')
    .description('Create a new spec snapshot')
    .argument('<version>', 'version identifier (e.g., v1.0.0, alpha, beta)')
    .option('-d, --description <text>', 'description of this snapshot')
    .option('-f, --file <path>', 'path to spec file', 'spec.yaml')
    .action(async (version, options) => {
    try {
        const projectRoot = path.resolve('.');
        const manager = (0, snapshot_manager_1.createSnapshotManager)(projectRoot, options.file);
        await manager.initialize();
        await manager.createSnapshot(version, options.description);
    }
    catch (err) {
        (0, cli_1.cliError)(`Snapshot creation failed: ${err.message}`);
        process.exit(1);
    }
}))
    .addCommand(new commander_1.Command('list')
    .description('List all spec snapshots')
    .option('-f, --file <path>', 'path to spec file', 'spec.yaml')
    .action(async (options) => {
    try {
        const projectRoot = path.resolve('.');
        const manager = (0, snapshot_manager_1.createSnapshotManager)(projectRoot, options.file);
        const snapshots = await manager.listSnapshots();
        if (snapshots.length === 0) {
            console.log('📂 No snapshots found. Create your first snapshot with:');
            console.log('   vibe snapshot create v1.0.0 --description "Initial version"');
            return;
        }
        console.log('📸 Available Snapshots:');
        console.log('─'.repeat(60));
        snapshots.forEach((snap, index) => {
            const date = new Date(snap.timestamp).toLocaleString();
            const marker = index === 0 ? '🆕' : '   ';
            console.log(`${marker} ${snap.version.padEnd(10)} ${date.padEnd(25)} ${snap.hash}`);
            if (snap.description && snap.description !== 'No description') {
                console.log(`     └─ ${snap.description}`);
            }
        });
        console.log('\n💡 Use "vibe snapshot show <version>" for detailed information');
    }
    catch (err) {
        (0, cli_1.cliError)(`Failed to list snapshots: ${err.message}`);
        process.exit(1);
    }
}))
    .addCommand(new commander_1.Command('show')
    .description('Show snapshot details')
    .argument('<version>', 'snapshot version identifier')
    .option('-f, --file <path>', 'path to spec file', 'spec.yaml')
    .action(async (version, options) => {
    try {
        const projectRoot = path.resolve('.');
        const manager = (0, snapshot_manager_1.createSnapshotManager)(projectRoot, options.file);
        await manager.showSnapshot(version);
    }
    catch (err) {
        (0, cli_1.cliError)(`Failed to show snapshot: ${err.message}`);
        process.exit(1);
    }
}))
    .addCommand(new commander_1.Command('restore')
    .description('Restore spec from a snapshot')
    .argument('<version>', 'snapshot version to restore')
    .option('-f, --file <path>', 'path to spec file', 'spec.yaml')
    .action(async (version, options) => {
    try {
        (0, cli_1.info)(`⚠️ This will overwrite your current ${options.file}`);
        (0, cli_1.info)('A backup will be created automatically.');
        const projectRoot = path.resolve('.');
        const manager = (0, snapshot_manager_1.createSnapshotManager)(projectRoot, options.file);
        await manager.restoreSnapshot(version);
    }
    catch (err) {
        (0, cli_1.cliError)(`Failed to restore snapshot: ${err.message}`);
        process.exit(1);
    }
}))
    .addCommand(new commander_1.Command('delete')
    .description('Delete a snapshot')
    .argument('<version>', 'snapshot version to delete')
    .option('-f, --file <path>', 'path to spec file', 'spec.yaml')
    .option('--force', 'skip confirmation')
    .action(async (version, options) => {
    try {
        if (!options.force) {
            console.log(`⚠️ This will permanently delete snapshot: ${version}`);
            console.log('Press Enter to continue or Ctrl+C to cancel...');
            process.stdin.setRawMode(true);
            process.stdin.resume();
            await new Promise(resolve => {
                process.stdin.once('data', (key) => {
                    process.stdin.setRawMode(false);
                    resolve(key);
                });
            });
        }
        const projectRoot = path.resolve('.');
        const manager = (0, snapshot_manager_1.createSnapshotManager)(projectRoot, options.file);
        await manager.deleteSnapshot(version);
    }
    catch (err) {
        (0, cli_1.cliError)(`Failed to delete snapshot: ${err.message}`);
        process.exit(1);
    }
}));
