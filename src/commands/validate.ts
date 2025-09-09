import { Command } from 'commander';
import * as fs from 'fs-extra';
import * as path from 'path';
import { createCommand, cliError, success, info } from '../lib/cli';
import { loadSpec, validateSpec } from '../lib/spec-parser';

export const validateCommand = createCommand('validate', 'Validate spec.yaml file and report issues')
  .option('-f, --file <path>', 'path to spec file', 'spec.yaml')
  .option('-v, --verbose', 'show additional details')
  .action(async (options) => {
    try {
      const specPath = path.isAbsolute(options.file)
        ? options.file
        : path.join(process.cwd(), options.file);

      // Check if file exists
      const exists = await fs.pathExists(specPath);
      if (!exists) {
        cliError(`Spec file not found: ${options.file}`);
        cliError('Use "vibe init" to create a spec.yaml file first.');
        process.exit(1);
      }

      // Load and validate spec
      const spec = await loadSpec(specPath);
      const validation = validateSpec(spec);

      if (validation.valid) {
        success(`✓ ${options.file} is valid`);

        if (validation.warnings && validation.warnings.length > 0) {
          info(`Warnings found (${validation.warnings.length}):`);
          validation.warnings.forEach((warning, index) => {
            console.log(`  ${index + 1}. ${warning}`);
          });
        } else if (options.verbose) {
          info('No errors or warnings found.');
        }

        if (options.verbose) {
          info(`\nSpec summary:`);
          console.log(`  Project: ${spec.project || 'Not specified'}`);
          console.log(`  Version: ${spec.version || 'Not specified'}`);
          console.log(`  Goals: ${spec.goals?.length || 0}`);
          console.log(`  Features: ${spec.features?.length || 0}`);
        }
      } else {
        cliError(`✗ ${options.file} has validation errors:`);
        validation.errors.forEach((error, index) => {
          console.log(`  ${index + 1}. ${error}`);
        });

        if (validation.warnings && validation.warnings.length > 0) {
          info(`\nWarnings (${validation.warnings.length}):`);
          validation.warnings.forEach((warning, index) => {
            console.log(`  ${index + 1}. ${warning}`);
          });
        }

        info('\nTo fix these issues, edit your spec.yaml file.');
        process.exit(1);
      }

    } catch (err) {
      cliError(`Failed to validate spec: ${(err as Error).message}`);
      if (options.verbose) {
        console.error((err as Error).stack);
      }
      process.exit(1);
    }
  });