import { Command } from 'commander';
import * as path from 'path';
import { createCommand, success, cliError, info } from '../lib/cli';
import { createSnapshotManager } from '../lib/snapshot-manager';

export const snapshotCommand = createCommand('snapshot', 'Manage spec snapshots and versioning')
  .addCommand(
    new Command('create')
      .description('Create a new spec snapshot')
      .argument('<version>', 'version identifier (e.g., v1.0.0, alpha, beta)')
      .option('-d, --description <text>', 'description of this snapshot')
      .option('-f, --file <path>', 'path to spec file', 'spec.yaml')
      .action(async (version, options) => {
        try {
          const projectRoot = path.resolve('.');
          const manager = createSnapshotManager(projectRoot, options.file);
          await manager.initialize();
          await manager.createSnapshot(version, options.description);
        } catch (err) {
          cliError(`Snapshot creation failed: ${(err as Error).message}`);
          process.exit(1);
        }
      })
  )
  .addCommand(
    new Command('list')
      .description('List all spec snapshots')
      .option('-f, --file <path>', 'path to spec file', 'spec.yaml')
      .action(async (options) => {
        try {
          const projectRoot = path.resolve('.');
          const manager = createSnapshotManager(projectRoot, options.file);
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

        } catch (err) {
          cliError(`Failed to list snapshots: ${(err as Error).message}`);
          process.exit(1);
        }
      })
  )
  .addCommand(
    new Command('show')
      .description('Show snapshot details')
      .argument('<version>', 'snapshot version identifier')
      .option('-f, --file <path>', 'path to spec file', 'spec.yaml')
      .action(async (version, options) => {
        try {
          const projectRoot = path.resolve('.');
          const manager = createSnapshotManager(projectRoot, options.file);
          await manager.showSnapshot(version);
        } catch (err) {
          cliError(`Failed to show snapshot: ${(err as Error).message}`);
          process.exit(1);
        }
      })
  )
  .addCommand(
    new Command('restore')
      .description('Restore spec from a snapshot')
      .argument('<version>', 'snapshot version to restore')
      .option('-f, --file <path>', 'path to spec file', 'spec.yaml')
      .action(async (version, options) => {
        try {
          info(`⚠️ This will overwrite your current ${options.file}`);
          info('A backup will be created automatically.');

          const projectRoot = path.resolve('.');
          const manager = createSnapshotManager(projectRoot, options.file);
          await manager.restoreSnapshot(version);
        } catch (err) {
          cliError(`Failed to restore snapshot: ${(err as Error).message}`);
          process.exit(1);
        }
      })
  )
  .addCommand(
    new Command('delete')
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
          const manager = createSnapshotManager(projectRoot, options.file);
          await manager.deleteSnapshot(version);
        } catch (err) {
          cliError(`Failed to delete snapshot: ${(err as Error).message}`);
          process.exit(1);
        }
      })
  );