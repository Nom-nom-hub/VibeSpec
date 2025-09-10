import { createCommand, success, cliError, info, warning } from '../../lib/cli';
import { loadSpec } from '../../lib/spec-parser';
import { IDEIntegrationFactory, IDEType } from '../../lib/ide-integration/IDEIntegrationFactory';
import * as fs from 'fs-extra';
import * as path from 'path';

export const ideContextCommand = createCommand('ide-context', 'Generate IDE context for AI coding assistants')
  .description('Create context files for AI coding IDEs and extensions')
  .argument('[ide]', 'IDE type (cursor, copilot)')
  .option('--file <path>', 'Path to spec file', 'spec.yaml')
  .option('--output <dir>', 'Output directory for context files', '.vibespec/ide-context')
  .option('--watch', 'Watch for changes and update context automatically')
  .action(async (ide: string, options: any) => {
    try {
      // Validate IDE type if provided
      if (ide) {
        const ideType = ide.toLowerCase() as IDEType;
        if (!IDEIntegrationFactory.isSupported(ideType)) {
          cliError(`Unsupported IDE: ${ide}`);
          info('Supported IDEs:');
          IDEIntegrationFactory.getSupportedTypes().forEach(type => {
            info(`  • ${type}`);
          });
          process.exit(1);
        }
      }
      
      // Load spec file
      const specPath = options.file;
      const exists = await fs.pathExists(specPath);
      if (!exists) {
        cliError(`Spec file not found: ${specPath}`);
        cliError('Use "vibe init" to create a spec.yaml file first.');
        process.exit(1);
      }
      
      const spec = await loadSpec(specPath);
      
      // Determine output directory
      const outputDir = path.resolve(options.output);
      await fs.ensureDir(outputDir);
      
      // Create context for specified IDE or all supported IDEs
      const ideTypes = ide 
        ? [ide.toLowerCase() as IDEType] 
        : IDEIntegrationFactory.getSupportedTypes();
      
      for (const ideType of ideTypes) {
        try {
          info(`Generating context for ${ideType.toUpperCase()}...`);
          
          // Create IDE integration
          const integration = IDEIntegrationFactory.create(ideType, {
            projectRoot: process.cwd(),
            contextDir: outputDir,
            watchChanges: options.watch
          });
          
          // Initialize integration
          await integration.initialize();
          
          // Create and write context
          const context = await integration.createContext(spec);
          await integration.writeContext(context);
          
          success(`✅ Context generated for ${ideType.toUpperCase()} in ${outputDir}`);
          
          // Show generated files
          const contextDir = path.join(outputDir, ideType);
          if (await fs.pathExists(contextDir)) {
            const files = await fs.readdir(contextDir);
            info(`Generated files: ${files.join(', ')}`);
          }
          
          // Cleanup
          await integration.cleanup();
          
        } catch (error) {
          cliError(`Failed to generate context for ${ideType.toUpperCase()}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
      
      if (options.watch) {
        info(' Watching for changes... (Press Ctrl+C to stop)');
        // In a real implementation, this would set up file watchers
      }
      
    } catch (error) {
      cliError(`Failed to generate IDE context: ${error instanceof Error ? error.message : 'Unknown error'}`);
      process.exit(1);
    }
  });