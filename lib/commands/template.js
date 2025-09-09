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
exports.templateCommand = void 0;
const commander_1 = require("commander");
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const cli_1 = require("../lib/cli");
const templates_1 = require("../lib/templates");
exports.templateCommand = (0, cli_1.createCommand)('template', 'Manage custom spec templates')
    .addCommand(new commander_1.Command('list')
    .description('List available templates')
    .action(async () => {
    console.log('📋 Available Templates:');
    console.log('═'.repeat(50));
    const builtInTemplates = await (0, templates_1.getAvailableTemplates)();
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
                    }
                    catch {
                        console.log(`   custom:${name} - Loading failed`);
                    }
                }
            }
            else {
                console.log('\n🔧 Custom Templates: None found');
                (0, cli_1.info)('Create your first custom template with: vibe template create <name>');
            }
        }
    }
    catch (err) {
        console.log('\n🔧 Custom Templates: Error loading');
    }
    console.log(`\n💡 Use "vibe init --template <type>" to use a template`);
}))
    .addCommand(new commander_1.Command('create')
    .description('Create a custom template')
    .argument('<name>', 'template name (use kebab-case)')
    .option('-d, --description <text>', 'description of the template')
    .option('-f, --file <path>', 'copy from existing spec file', 'spec.yaml')
    .option('--minimal', 'create minimal template structure')
    .action(async (name, options) => {
    try {
        // Validate template name
        if (!/^[a-z][a-z\-]*[a-z]$/.test(name)) {
            (0, cli_1.cliError)('Template name must be kebab-case (lowercase letters and hyphens only)');
            (0, cli_1.cliError)('Examples: my-template, api-spec, web-app');
            process.exit(1);
        }
        const customDir = getCustomTemplatesDir();
        await fs.ensureDir(customDir);
        const templatePath = path.join(customDir, `${name}.yaml`);
        if (await fs.pathExists(templatePath)) {
            (0, cli_1.cliError)(`Template "${name}" already exists. Use different name or delete existing first.`);
            process.exit(1);
        }
        let content;
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
        }
        else if (options.file !== 'spec.yaml') {
            // Copy from specified file
            if (!(await fs.pathExists(options.file))) {
                (0, cli_1.cliError)(`Source file not found: ${options.file}`);
                process.exit(1);
            }
            content = await fs.readFile(options.file, 'utf-8');
        }
        else {
            // Copy from current spec.yaml
            if (!(await fs.pathExists('spec.yaml'))) {
                (0, cli_1.warning)('No spec.yaml found, creating minimal template');
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
            }
            else {
                content = await fs.readFile('spec.yaml', 'utf-8');
            }
        }
        // Add template metadata
        const header = `# Custom Template: ${name}\n# Description: ${options.description || name}\n# Created: ${new Date().toISOString()}\n\n`;
        const finalContent = header + content;
        await fs.writeFile(templatePath, finalContent);
        (0, cli_1.success)(`Created custom template: ${name}`);
        (0, cli_1.info)(`Location: ${templatePath}`);
        (0, cli_1.info)(`Use with: vibe init --template custom:${name}`);
    }
    catch (err) {
        (0, cli_1.cliError)(`Failed to create template: ${err.message}`);
        process.exit(1);
    }
}))
    .addCommand(new commander_1.Command('delete')
    .description('Delete a custom template')
    .argument('<name>', 'template name to delete')
    .option('--force', 'skip confirmation')
    .action(async (name, options) => {
    try {
        const customDir = getCustomTemplatesDir();
        const templatePath = path.join(customDir, `${name}.yaml`);
        if (!(await fs.pathExists(templatePath))) {
            (0, cli_1.cliError)(`Custom template "${name}" not found`);
            process.exit(1);
        }
        if (!options.force) {
            (0, cli_1.warning)(`This will permanently delete template: ${name}`);
            (0, cli_1.info)('Press Enter to continue or Ctrl+C to cancel...');
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
        (0, cli_1.success)(`Deleted custom template: ${name}`);
    }
    catch (err) {
        (0, cli_1.cliError)(`Failed to delete template: ${err.message}`);
        process.exit(1);
    }
}))
    .addCommand(new commander_1.Command('show')
    .description('Show template contents')
    .argument('<name>', 'template name or type to show')
    .action(async (name) => {
    try {
        // Check if it's a built-in template
        if (!name.startsWith('custom:')) {
            const builtInTemplates = await (0, templates_1.getAvailableTemplates)();
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
            (0, cli_1.cliError)(`Template "${name}" not found`);
            process.exit(1);
        }
        const content = await fs.readFile(templatePath, 'utf-8');
        console.log(`📄 Custom Template: ${customName}`);
        console.log('\n' + '='.repeat(50));
        console.log(content);
        console.log('='.repeat(50));
    }
    catch (err) {
        (0, cli_1.cliError)(`Failed to show template: ${err.message}`);
        process.exit(1);
    }
}));
function getCustomTemplatesDir() {
    return path.join(require('os').homedir(), '.vibespec', 'templates');
}
