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
exports.validateCommand = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const cli_1 = require("../lib/cli");
const spec_parser_1 = require("../lib/spec-parser");
exports.validateCommand = (0, cli_1.createCommand)('validate', 'Validate spec.yaml file and report issues')
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
            (0, cli_1.cliError)(`Spec file not found: ${options.file}`);
            (0, cli_1.cliError)('Use "vibe init" to create a spec.yaml file first.');
            process.exit(1);
        }
        // Load and validate spec
        const spec = await (0, spec_parser_1.loadSpec)(specPath);
        const validation = (0, spec_parser_1.validateSpec)(spec);
        if (validation.valid) {
            (0, cli_1.success)(`✓ ${options.file} is valid`);
            if (validation.warnings && validation.warnings.length > 0) {
                (0, cli_1.info)(`Warnings found (${validation.warnings.length}):`);
                validation.warnings.forEach((warning, index) => {
                    console.log(`  ${index + 1}. ${warning}`);
                });
            }
            else if (options.verbose) {
                (0, cli_1.info)('No errors or warnings found.');
            }
            if (options.verbose) {
                (0, cli_1.info)(`\nSpec summary:`);
                console.log(`  Project: ${spec.project || 'Not specified'}`);
                console.log(`  Version: ${spec.version || 'Not specified'}`);
                console.log(`  Goals: ${spec.goals?.length || 0}`);
                console.log(`  Features: ${spec.features?.length || 0}`);
            }
        }
        else {
            (0, cli_1.cliError)(`✗ ${options.file} has validation errors:`);
            validation.errors.forEach((error, index) => {
                console.log(`  ${index + 1}. ${error}`);
            });
            if (validation.warnings && validation.warnings.length > 0) {
                (0, cli_1.info)(`\nWarnings (${validation.warnings.length}):`);
                validation.warnings.forEach((warning, index) => {
                    console.log(`  ${index + 1}. ${warning}`);
                });
            }
            (0, cli_1.info)('\nTo fix these issues, edit your spec.yaml file.');
            process.exit(1);
        }
    }
    catch (err) {
        (0, cli_1.cliError)(`Failed to validate spec: ${err.message}`);
        if (options.verbose) {
            console.error(err.stack);
        }
        process.exit(1);
    }
});
