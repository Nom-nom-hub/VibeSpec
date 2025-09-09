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
exports.genCommand = void 0;
const fs = __importStar(require("fs-extra"));
const cli_1 = require("../lib/cli");
const spec_parser_1 = require("../lib/spec-parser");
const generators_1 = require("../lib/generators");
exports.genCommand = (0, cli_1.createCommand)('gen', 'Generate documentation from spec.yaml')
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
            (0, cli_1.cliError)(`Spec file not found: ${specPath}`);
            (0, cli_1.cliError)('Use "vibe init" to create a spec.yaml file first.');
            process.exit(1);
        }
        // Load and validate spec
        console.log('🔍 Validating spec...');
        const spec = await (0, spec_parser_1.loadSpec)(specPath);
        const validation = (0, spec_parser_1.validateSpec)(spec);
        if (!validation.valid) {
            (0, cli_1.cliError)('Spec validation failed:');
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
        (0, cli_1.success)('Spec is valid');
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
        const generator = (0, generators_1.getGenerator)(format);
        console.log(`📝 Generating ${format.toUpperCase()} documentation...`);
        const output = generator(spec);
        // Write output
        if (!options.output) {
            // Output to stdout
            console.log('\n' + '='.repeat(50));
            console.log(output);
        }
        else {
            await (0, generators_1.writeOutput)(output, spec, options.output, format);
            (0, cli_1.success)(`Documentation written to: ${options.output}`);
        }
        if (validation.warnings && validation.warnings.length > 0) {
            console.log('\n⚠️ Warnings:');
            validation.warnings.forEach((warning) => {
                console.log(`  • ${warning}`);
            });
        }
        (0, cli_1.success)('Documentation generated successfully!');
    }
    catch (err) {
        (0, cli_1.cliError)(`Generation failed: ${err.message}`);
        (0, cli_1.info)('💡 Suggestions:');
        (0, cli_1.info)('   • Check if spec.yaml exists and is valid using "vibe validate"');
        (0, cli_1.info)('   • Use --verbose flag for more details');
        (0, cli_1.info)('   • Make sure output directory exists or try without --output for stdout');
        process.exit(1);
    }
});
