import { Command } from 'commander';
import * as fs from 'fs-extra';
import { createCommand, success, cliError, info } from '../lib/cli';
import { loadSpec, validateSpec } from '../lib/spec-parser';
import { getGenerator, writeOutput } from '../lib/generators';

export const genCommand = createCommand('gen', 'Generate documentation from spec.yaml')
  .option('-f, --format <type>', 'output format (md, txt)', 'md')
  .option('-o, --output <path>', 'output directory or file path', '')
  .option('--validate-only', 'only validate spec without generating output')
  .option('--file <path>', 'path to spec file', 'spec.yaml')
  .action(async (options) => {
    try {
      const specPath = options.file;

      // Check if spec file exists
      const exists = await fs.pathExists(specPath);
      if (!exists) {
        cliError(`Spec file not found: ${specPath}`);
        cliError('Use "vibe init" to create a spec.yaml file first.');
        process.exit(1);
      }

      // Load and validate spec
      console.log('🔍 Validating spec...');
      const spec = await loadSpec(specPath);
      const validation = validateSpec(spec);

      if (!validation.valid) {
        cliError('Spec validation failed:');
        validation.errors.forEach((error, index) => {
          console.log(`  ${index + 1}. ${error}`);
        });
        if (validation.warnings && validation.warnings.length > 0) {
          console.log('\nWarnings:');
          validation.warnings.forEach((warning) => {
            console.log(`  • ${warning}`);
          });
        }
        process.exit(1);
      }

      success('Spec is valid');

      // If validation only, we're done
      if (options.validateOnly) {
        if (validation.warnings && validation.warnings.length > 0) {
          console.log('\nWarnings:');
          validation.warnings.forEach((warning) => {
            console.log(`  • ${warning}`);
          });
        }
        return;
      }

      // Generate output
      const format = options.format.toLowerCase();
      const generator = getGenerator(format);

      console.log(`📝 Generating ${format.toUpperCase()} documentation...`);
      const output = generator(spec);

      // Write output
      if (!options.output) {
        // Output to stdout
        console.log('\n' + '='.repeat(50));
        console.log(output);
      } else {
        await writeOutput(output, spec, options.output, format);
        success(`Documentation written to: ${options.output}`);
      }

      if (validation.warnings && validation.warnings.length > 0) {
        console.log('\n⚠️ Warnings:');
        validation.warnings.forEach((warning) => {
          console.log(`  • ${warning}`);
        });
      }

      success('Documentation generated successfully!');

    } catch (err) {
      cliError(`Generation failed: ${(err as Error).message}`);
      info('💡 Suggestions:');
      info('   • Check if spec.yaml exists and is valid using "vibe validate"');
      info('   • Use --verbose flag for more details');
      info('   • Make sure output directory exists or try without --output for stdout');
      process.exit(1);
    }
  });