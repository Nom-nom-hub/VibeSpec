import { Command } from 'commander';
import * as fs from 'fs-extra';
import * as path from 'path';
import { createCommand, success, cliError, info, warning } from '../lib/cli';
import { getAvailableTemplates } from '../lib/templates';

export const templateCommand = createCommand('template', 'Manage custom spec templates')
  .addCommand(
    new Command('list')
      .description('List available templates')
      .action(async () => {
        console.log('📋 Available Templates:');
        console.log('═'.repeat(50));

        const builtInTemplates = await getAvailableTemplates();
        console.log('\n🏗️ Built-in Templates:');
        builtInTemplates.forEach(template => {
          console.log(`   ${template.type.padEnd(10)} - ${template.description}`);
        });

        // Check for custom templates
        const customDir = getCustomTemplatesDir();
        try {
          const exists = await fs.pathExists(customDir);
          if (exists) {
            const customTemplates = await fs.readdir(customDir);
            const yamlFiles = customTemplates.filter(file => file.endsWith('.yaml'));

            if (yamlFiles.length > 0) {
              console.log('\n🔧 Custom Templates:');
              for (const file of yamlFiles) {
                const name = path.basename(file, '.yaml');
                try {
                  const content = await fs.readFile(path.join(customDir, file), 'utf-8');
                  const lines = content.split('\n');
                  const descriptionLine = lines.find(line => line.startsWith('# Description:'));
                  const description = descriptionLine
                    ? descriptionLine.replace('# Description:', '').trim()
                    : 'Custom template';

                  console.log(`   custom:${name} - ${description}`);
                } catch {
                  console.log(`   custom:${name} - Loading failed`);
                }
              }
            } else {
              console.log('\n🔧 Custom Templates: None found');
              info('Create your first custom template with: vibe template create <name>');
            }
          }
        } catch (err) {
          console.log('\n🔧 Custom Templates: Error loading');
        }

        console.log(`\n💡 Use "vibe init --template <type>" to use a template`);
      })
  )
  .addCommand(
    new Command('create')
      .description('Create a custom template')
      .argument('<name>', 'template name (use kebab-case)')
      .option('-d, --description <text>', 'description of the template')
      .option('-f, --file <path>', 'copy from existing spec file', 'spec.yaml')
      .option('--minimal', 'create minimal template structure')
      .action(async (name, options) => {
        try {
          // Validate template name
          if (!/^[a-z][a-z\-]*[a-z]$/.test(name)) {
            cliError('Template name must be kebab-case (lowercase letters and hyphens only)');
            cliError('Examples: my-template, api-spec, web-app');
            process.exit(1);
          }

          const customDir = getCustomTemplatesDir();
          await fs.ensureDir(customDir);

          const templatePath = path.join(customDir, `${name}.yaml`);

          if (await fs.pathExists(templatePath)) {
            cliError(`Template "${name}" already exists. Use different name or delete existing first.`);
            process.exit(1);
          }

          let content: string;

          if (options.minimal) {
            // Create minimal template
            content = `# Custom Template: ${name}
# Description: ${options.description || name}

project: "Your Project Name"
version: "0.1.0"
description: >
  Project description

goals:
  - Goal 1
  - Goal 2

features:
  - name: "Feature 1"
    description: "Description"
    requirements:
      - Requirement 1
`;
          } else if (options.file !== 'spec.yaml') {
            // Copy from specified file
            if (!(await fs.pathExists(options.file))) {
              cliError(`Source file not found: ${options.file}`);
              process.exit(1);
            }
            content = await fs.readFile(options.file, 'utf-8');
          } else {
            // Copy from current spec.yaml
            if (!(await fs.pathExists('spec.yaml'))) {
              warning('No spec.yaml found, creating minimal template');
              content = `# Custom Template: ${name}
# Description: ${options.description || name}

project: "Your Project Name"
version: "0.1.0"
description: "Project description"

goals:
  - Goal 1

features:
  - name: "Sample Feature"
    description: "Sample feature description"
    requirements:
      - Sample requirement
`;
            } else {
              content = await fs.readFile('spec.yaml', 'utf-8');
            }
          }

          // Add template metadata
          const header = `# Custom Template: ${name}\n# Description: ${options.description || name}\n# Created: ${new Date().toISOString()}\n\n`;
          const finalContent = header + content;

          await fs.writeFile(templatePath, finalContent);

          success(`Created custom template: ${name}`);
          info(`Location: ${templatePath}`);
          info(`Use with: vibe init --template custom:${name}`);

        } catch (err) {
          cliError(`Failed to create template: ${(err as Error).message}`);
          process.exit(1);
        }
      })
  )
  .addCommand(
    new Command('delete')
      .description('Delete a custom template')
      .argument('<name>', 'template name to delete')
      .option('--force', 'skip confirmation')
      .action(async (name, options) => {
        try {
          const customDir = getCustomTemplatesDir();
          const templatePath = path.join(customDir, `${name}.yaml`);

          if (!(await fs.pathExists(templatePath))) {
            cliError(`Custom template "${name}" not found`);
            process.exit(1);
          }

          if (!options.force) {
            warning(`This will permanently delete template: ${name}`);
            info('Press Enter to continue or Ctrl+C to cancel...');

            process.stdin.setRawMode(true);
            process.stdin.resume();
            await new Promise(resolve => {
              process.stdin.once('data', (key) => {
                process.stdin.setRawMode(false);
                resolve(key);
              });
            });
          }

          await fs.remove(templatePath);
          success(`Deleted custom template: ${name}`);

        } catch (err) {
          cliError(`Failed to delete template: ${(err as Error).message}`);
          process.exit(1);
        }
      })
  )
  .addCommand(
    new Command('show')
      .description('Show template contents')
      .argument('<name>', 'template name or type to show')
      .action(async (name) => {
        try {
          // Check if it's a built-in template
          if (!name.startsWith('custom:')) {
            const builtInTemplates = await getAvailableTemplates();
            const template = builtInTemplates.find(t => t.type === name);

            if (template) {
              console.log(`📋 Built-in Template: ${template.name}`);
              console.log(`📝 Description: ${template.description}`);
              return;
            }
          }

          // It's a custom template
          const customName = name.replace('custom:', '');
          const customDir = getCustomTemplatesDir();
          const templatePath = path.join(customDir, `${customName}.yaml`);

          if (!(await fs.pathExists(templatePath))) {
            cliError(`Template "${name}" not found`);
            process.exit(1);
          }

          const content = await fs.readFile(templatePath, 'utf-8');
          console.log(`📄 Custom Template: ${customName}`);
          console.log('\n' + '='.repeat(50));
          console.log(content);
          console.log('='.repeat(50));

        } catch (err) {
          cliError(`Failed to show template: ${(err as Error).message}`);
          process.exit(1);
        }
      })
  );

function getCustomTemplatesDir(): string {
  return path.join(require('os').homedir(), '.vibespec', 'templates');
}