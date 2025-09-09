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
exports.initCommand = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const cli_1 = require("../lib/cli");
const spec_parser_1 = require("../lib/spec-parser");
exports.initCommand = (0, cli_1.createCommand)('init', 'Initialize a new VibeSpec project')
    .option('-f, --force', 'force creation even if project already exists')
    .option('-t, --template <type>', `template type (library, default, api, web-app, mobile-app, microservice, cli-tool, ai-agent, game, data-pipeline, prd, empty)`, 'default')
    .action(async (options) => {
    try {
        const specPath = path.join(process.cwd(), 'spec.yaml');
        const exists = await fs.pathExists(specPath);
        if (exists && !options.force) {
            (0, cli_1.cliError)('spec.yaml already exists. Use --force to overwrite.');
            process.exit(1);
        }
        // Validate template type - get async list of available templates
        const { getAvailableTemplates } = require('../lib/templates');
        const availableTemplates = await getAvailableTemplates();
        const validTemplates = availableTemplates.map((t) => t.type);
        if (!validTemplates.includes(options.template)) {
            (0, cli_1.cliError)(`Invalid template: ${options.template}`);
            (0, cli_1.info)('Available templates:');
            availableTemplates.forEach((t) => {
                (0, cli_1.info)(`  ${t.type}: ${t.description}`);
            });
            process.exit(1);
        }
        // Get template content - await the async template loading
        const { getTemplate } = require('../lib/templates');
        const template = await getTemplate(options.template);
        if (!template) {
            (0, cli_1.cliError)(`Template "${options.template}" could not be loaded`);
            process.exit(1);
        }
        // Write the spec file
        await fs.writeFile(specPath, template.content);
        // Validate the created spec file
        try {
            const spec = await (0, spec_parser_1.loadSpec)(specPath);
            const validation = (0, spec_parser_1.validateSpec)(spec);
            if (validation.valid) {
                (0, cli_1.success)(`Created spec.yaml using template: ${template.name}`);
                (0, cli_1.success)('VibeSpec project initialized successfully!');
                (0, cli_1.info)('Next steps:');
                (0, cli_1.info)('  1. Edit spec.yaml to customize your project');
                (0, cli_1.info)('  2. Run "vibe validate" to check your spec');
                (0, cli_1.info)('  3. Use "vibe plan" to generate implementation plan');
            }
            else {
                (0, cli_1.cliError)('Created spec.yaml but validation failed:');
                validation.errors.forEach(error => {
                    (0, cli_1.cliError)(`  • ${error}`);
                });
                if (validation.warnings && validation.warnings.length > 0) {
                    (0, cli_1.info)('Warnings:');
                    validation.warnings.forEach(warning => {
                        (0, cli_1.info)(`  • ${warning}`);
                    });
                }
                process.exit(1);
            }
        }
        catch (parseError) {
            (0, cli_1.cliError)(`Created spec.yaml but failed to parse: ${parseError.message}`);
            process.exit(1);
        }
    }
    catch (err) {
        (0, cli_1.cliError)(`Failed to initialize project: ${err.message}`);
        (0, cli_1.info)('💡 Troubleshooting:');
        (0, cli_1.info)('   • Check if the directory is writable');
        (0, cli_1.info)('   • Try running with --force to overwrite existing files');
        (0, cli_1.info)('   • Use --template to specify a different template');
        (0, cli_1.info)('   • Use --verbose for more error details');
        process.exit(1);
    }
});
