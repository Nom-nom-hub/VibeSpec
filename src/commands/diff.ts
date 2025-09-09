import { Command } from 'commander';
import * as fs from 'fs-extra';
import { createCommand, cliError, info } from '../lib/cli';
import { loadSpec, validateSpec } from '../lib/spec-parser';
import { compareSpecs, formatDiff, getDiffSummary } from '../lib/spec-comparator';

export const diffCommand = createCommand('diff', 'Compare two spec files or versions')
  .argument('<file1>', 'first spec file')
  .argument('<file2>', 'second spec file')
  .option('--show-summary', 'show summary statistics', false)
  .action(async (file1: string, file2: string, options) => {
    try {
      // Check if files exist
      const exists1 = await fs.pathExists(file1);
      const exists2 = await fs.pathExists(file2);

      if (!exists1) {
        cliError(`First spec file not found: ${file1}`);
        process.exit(1);
      }

      if (!exists2) {
        cliError(`Second spec file not found: ${file2}`);
        process.exit(1);
      }

      // Load and validate both specs
      console.log('🔍 Loading and validating specs...');

      const spec1 = await loadSpec(file1);
      const validation1 = validateSpec(spec1);

      const spec2 = await loadSpec(file2);
      const validation2 = validateSpec(spec2);

      if (!validation1.valid) {
        cliError(`First spec (${file1}) has validation errors and cannot be compared.`);
        validation1.errors.forEach(error => console.log(`  • ${error}`));
        process.exit(1);
      }

      if (!validation2.valid) {
        cliError(`Second spec (${file2}) has validation errors and cannot be compared.`);
        validation2.errors.forEach(error => console.log(`  • ${error}`));
        process.exit(1);
      }

      console.log('📊 Comparing specs...');
      const diff = compareSpecs(spec1, spec2);

      // Show summary if requested
      if (options.showSummary) {
        const summary = getDiffSummary(diff);
        console.log('\n📈 Summary:');
        console.log(`  Added: ${summary.additions}`);
        console.log(`  Removed: ${summary.removals}`);
        console.log(`  Modified: ${summary.modifications}`);
        console.log(`  Unchanged: ${summary.unchanged}`);
        console.log('');
      }

      // Display differences
      const output = formatDiff(diff);
      console.log(output);

      // Exit with code based on whether differences were found
      if (diff.added.length > 0 || diff.removed.length > 0 || diff.modified.length > 0) {
        process.exit(1); // Changes found
      } else {
        console.log('✅ Specs are identical');
      }

    } catch (err) {
      cliError(`Diff failed: ${(err as Error).message}`);
      process.exit(1);
    }
  });