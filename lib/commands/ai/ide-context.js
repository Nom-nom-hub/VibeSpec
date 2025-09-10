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
exports.ideContextCommand = void 0;
const cli_1 = require("../../lib/cli");
const spec_parser_1 = require("../../lib/spec-parser");
const IDEIntegrationFactory_1 = require("../../lib/ide-integration/IDEIntegrationFactory");
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
exports.ideContextCommand = (0, cli_1.createCommand)('ide-context', 'Generate IDE context for AI coding assistants')
    .description('Create context files for AI coding IDEs and extensions')
    .argument('[ide]', 'IDE type (cursor, copilot)')
    .option('--file <path>', 'Path to spec file', 'spec.yaml')
    .option('--output <dir>', 'Output directory for context files', '.vibespec/ide-context')
    .option('--watch', 'Watch for changes and update context automatically')
    .action(async (ide, options) => {
    try {
        // Validate IDE type if provided
        if (ide) {
            const ideType = ide.toLowerCase();
            if (!IDEIntegrationFactory_1.IDEIntegrationFactory.isSupported(ideType)) {
                (0, cli_1.cliError)(`Unsupported IDE: ${ide}`);
                (0, cli_1.info)('Supported IDEs:');
                IDEIntegrationFactory_1.IDEIntegrationFactory.getSupportedTypes().forEach(type => {
                    (0, cli_1.info)(`  • ${type}`);
                });
                process.exit(1);
            }
        }
        // Load spec file
        const specPath = options.file;
        const exists = await fs.pathExists(specPath);
        if (!exists) {
            (0, cli_1.cliError)(`Spec file not found: ${specPath}`);
            (0, cli_1.cliError)('Use "vibe init" to create a spec.yaml file first.');
            process.exit(1);
        }
        const spec = await (0, spec_parser_1.loadSpec)(specPath);
        // Determine output directory
        const outputDir = path.resolve(options.output);
        await fs.ensureDir(outputDir);
        // Create context for specified IDE or all supported IDEs
        const ideTypes = ide
            ? [ide.toLowerCase()]
            : IDEIntegrationFactory_1.IDEIntegrationFactory.getSupportedTypes();
        for (const ideType of ideTypes) {
            try {
                (0, cli_1.info)(`Generating context for ${ideType.toUpperCase()}...`);
                // Create IDE integration
                const integration = IDEIntegrationFactory_1.IDEIntegrationFactory.create(ideType, {
                    projectRoot: process.cwd(),
                    contextDir: outputDir,
                    watchChanges: options.watch
                });
                // Initialize integration
                await integration.initialize();
                // Create and write context
                const context = await integration.createContext(spec);
                await integration.writeContext(context);
                (0, cli_1.success)(`✅ Context generated for ${ideType.toUpperCase()} in ${outputDir}`);
                // Show generated files
                const contextDir = path.join(outputDir, ideType);
                if (await fs.pathExists(contextDir)) {
                    const files = await fs.readdir(contextDir);
                    (0, cli_1.info)(`Generated files: ${files.join(', ')}`);
                }
                // Cleanup
                await integration.cleanup();
            }
            catch (error) {
                (0, cli_1.cliError)(`Failed to generate context for ${ideType.toUpperCase()}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
        if (options.watch) {
            (0, cli_1.info)(' Watching for changes... (Press Ctrl+C to stop)');
            // In a real implementation, this would set up file watchers
        }
    }
    catch (error) {
        (0, cli_1.cliError)(`Failed to generate IDE context: ${error instanceof Error ? error.message : 'Unknown error'}`);
        process.exit(1);
    }
});
