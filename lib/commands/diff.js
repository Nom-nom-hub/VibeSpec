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
exports.diffCommand = void 0;
const fs = __importStar(require("fs-extra"));
const cli_1 = require("../lib/cli");
const spec_parser_1 = require("../lib/spec-parser");
const spec_comparator_1 = require("../lib/spec-comparator");
exports.diffCommand = (0, cli_1.createCommand)('diff', 'Compare two spec files or versions')
    .argument('<file1>', 'first spec file')
    .argument('<file2>', 'second spec file')
    .option('--show-summary', 'show summary statistics', false)
    .action(async (file1, file2, options) => {
    try {
        // Check if files exist
        const exists1 = await fs.pathExists(file1);
        const exists2 = await fs.pathExists(file2);
        if (!exists1) {
            (0, cli_1.cliError)(`First spec file not found: ${file1}`);
            process.exit(1);
        }
        if (!exists2) {
            (0, cli_1.cliError)(`Second spec file not found: ${file2}`);
            process.exit(1);
        }
        // Load and validate both specs
        console.log('🔍 Loading and validating specs...');
        const spec1 = await (0, spec_parser_1.loadSpec)(file1);
        const validation1 = (0, spec_parser_1.validateSpec)(spec1);
        const spec2 = await (0, spec_parser_1.loadSpec)(file2);
        const validation2 = (0, spec_parser_1.validateSpec)(spec2);
        if (!validation1.valid) {
            (0, cli_1.cliError)(`First spec (${file1}) has validation errors and cannot be compared.`);
            validation1.errors.forEach(error => console.log(`  • ${error}`));
            process.exit(1);
        }
        if (!validation2.valid) {
            (0, cli_1.cliError)(`Second spec (${file2}) has validation errors and cannot be compared.`);
            validation2.errors.forEach(error => console.log(`  • ${error}`));
            process.exit(1);
        }
        console.log('📊 Comparing specs...');
        const diff = (0, spec_comparator_1.compareSpecs)(spec1, spec2);
        // Show summary if requested
        if (options.showSummary) {
            const summary = (0, spec_comparator_1.getDiffSummary)(diff);
            console.log('\n📈 Summary:');
            console.log(`  Added: ${summary.additions}`);
            console.log(`  Removed: ${summary.removals}`);
            console.log(`  Modified: ${summary.modifications}`);
            console.log(`  Unchanged: ${summary.unchanged}`);
            console.log('');
        }
        // Display differences
        const output = (0, spec_comparator_1.formatDiff)(diff);
        console.log(output);
        // Exit with code based on whether differences were found
        if (diff.added.length > 0 || diff.removed.length > 0 || diff.modified.length > 0) {
            process.exit(1); // Changes found
        }
        else {
            console.log('✅ Specs are identical');
        }
    }
    catch (err) {
        (0, cli_1.cliError)(`Diff failed: ${err.message}`);
        process.exit(1);
    }
});
