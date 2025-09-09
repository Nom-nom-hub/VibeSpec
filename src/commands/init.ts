import { Command } from 'commander';
import * as fs from 'fs-extra';
import * as path from 'path';
import { createCommand, success, cliError, info } from '../lib/cli';
import { getTemplate, getAvailableTemplates, TemplateType } from '../lib/templates';
import { loadSpec, validateSpec } from '../lib/spec-parser';

export const initCommand = createCommand('init', 'Initialize a new VibeSpec project')
  .option('-f, --force', 'force creation even if project already exists')
  .option('-t, --template <type>', `template type (library, default, api, web-app, mobile-app, microservice, cli-tool, ai-agent, game, data-pipeline, prd, empty)`, 'default')
  .action(async (options) => {
    try {
      const specPath = path.join(process.cwd(), 'spec.yaml');
      const exists = await fs.pathExists(specPath);

      if (exists && !options.force) {
        cliError('spec.yaml already exists. Use --force to overwrite.');
        process.exit(1);
      }

      // Validate template type - get async list of available templates
      const {getAvailableTemplates} = require('../lib/templates');
      const availableTemplates = await getAvailableTemplates();
      const validTemplates = availableTemplates.map((t: { type: string; name: string; description: string }) => t.type);

      if (!validTemplates.includes(options.template)) {
        cliError(`Invalid template: ${options.template}`);
        info('Available templates:');
        availableTemplates.forEach((t: { type: string; name: string; description: string }) => {
          info(`  ${t.type}: ${t.description}`);
        });
        process.exit(1);
      }

      // Get template content - await the async template loading
      const {getTemplate} = require('../lib/templates');
      const template = await getTemplate(options.template as TemplateType);

      if (!template) {
        cliError(`Template "${options.template}" could not be loaded`);
        process.exit(1);
      }

      // Write the spec file
      await fs.writeFile(specPath, template.content);

      // Validate the created spec file
      try {
        const spec = await loadSpec(specPath);
        const validation = validateSpec(spec);

        if (validation.valid) {
          success(`Created spec.yaml using template: ${template.name}`);
          success('VibeSpec project initialized successfully!');
          info('Next steps:');
          info('  1. Edit spec.yaml to customize your project');
          info('  2. Run "vibe validate" to check your spec');
          info('  3. Use "vibe plan" to generate implementation plan');
        } else {
          cliError('Created spec.yaml but validation failed:');
          validation.errors.forEach(error => {
            cliError(`  • ${error}`);
          });
          if (validation.warnings && validation.warnings.length > 0) {
            info('Warnings:');
            validation.warnings.forEach(warning => {
              info(`  • ${warning}`);
            });
          }
          process.exit(1);
        }

      } catch (parseError) {
        cliError(`Created spec.yaml but failed to parse: ${(parseError as Error).message}`);
        process.exit(1);
      }

    } catch (err) {
      cliError(`Failed to initialize project: ${(err as Error).message}`);
      info('💡 Troubleshooting:');
      info('   • Check if the directory is writable');
      info('   • Try running with --force to overwrite existing files');
      info('   • Use --template to specify a different template');
      info('   • Use --verbose for more error details');
      process.exit(1);
    }
  });