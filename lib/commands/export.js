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
exports.exportCommand = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const cli_1 = require("../lib/cli");
const spec_parser_1 = require("../lib/spec-parser");
exports.exportCommand = (0, cli_1.createCommand)('export', 'Export spec to different formats (JSON, CSV, YAML)')
    .option('-f, --format <type>', 'export format (json, csv, yaml)', 'json')
    .option('-o, --output <file>', 'output file path (default: auto-generated)')
    .option('--config <path>', 'path to spec file (default: "spec.yaml")', 'spec.yaml')
    .action(async (options) => {
    try {
        const specPath = path.resolve(process.cwd(), options.config);
        const format = options.format;
        // Validate format
        const validFormats = ['json', 'csv', 'yaml'];
        if (!validFormats.includes(format)) {
            (0, cli_1.cliError)(`Invalid export format: ${format}`);
            (0, cli_1.info)('Available formats: json, csv, yaml');
            process.exit(1);
        }
        // Load and validate spec
        const spec = await (0, spec_parser_1.loadSpec)(specPath);
        const validation = (0, spec_parser_1.validateSpec)(spec);
        if (!validation.valid) {
            (0, cli_1.cliError)('Spec validation failed. Cannot export invalid spec:');
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
        // Generate output file path
        const baseName = path.basename(specPath, path.extname(specPath));
        const outputPath = options.output || `${baseName}.${format}`;
        // Export based on format
        switch (format) {
            case 'json':
                await exportToJson(spec, outputPath);
                break;
            case 'csv':
                await exportToCsv(spec, outputPath);
                break;
            case 'yaml':
                await exportToYaml(spec, outputPath);
                break;
        }
        (0, cli_1.success)(`✅ Exported spec to ${outputPath} (${format} format)`);
        (0, cli_1.info)(`📊 Spec: ${spec.project} v${spec.version}`);
        (0, cli_1.info)(`🎯 Goals: ${spec.goals?.length || 0}`);
        (0, cli_1.info)(`⚙️ Features: ${spec.features?.length || 0}`);
    }
    catch (err) {
        (0, cli_1.cliError)(`Export failed: ${err.message}`);
        (0, cli_1.info)('💡 Troubleshooting:');
        (0, cli_1.info)('   • Check that the spec file exists and is valid');
        (0, cli_1.info)('   • Use --config to specify a different spec file');
        (0, cli_1.info)('   • Ensure output directory is writable');
        process.exit(1);
    }
});
async function exportToJson(spec, outputPath) {
    const jsonContent = JSON.stringify(spec, null, 2);
    await fs.writeFile(outputPath, jsonContent, 'utf8');
}
async function exportToCsv(spec, outputPath) {
    const rows = [];
    // Header
    rows.push('Project,Version,Description');
    // Basic info
    rows.push(`"${spec.project}","${spec.version}","${(spec.description || '').replace(/"/g, '""')}"`);
    // Goals
    if (spec.goals && spec.goals.length > 0) {
        spec.goals.forEach((goal, index) => {
            rows.push(`GOAL${index + 1},,"${goal.replace(/"/g, '""')}"`);
        });
    }
    // Features
    if (spec.features && spec.features.length > 0) {
        spec.features.forEach((feature) => {
            rows.push(`FEATURE,"${feature.name}","${(feature.description || '').replace(/"/g, '""')}"`);
            if (feature.requirements && feature.requirements.length > 0) {
                feature.requirements.forEach((req) => {
                    rows.push(`REQUIREMENT,,"${req.replace(/"/g, '""')}"`);
                });
            }
        });
    }
    await fs.writeFile(outputPath, rows.join('\n'), 'utf8');
}
async function exportToYaml(spec, outputPath) {
    const yaml = require('js-yaml');
    const yamlContent = yaml.dump(spec, {
        indent: 2,
        lineWidth: -1,
        noRefs: true
    });
    await fs.writeFile(outputPath, yamlContent, 'utf8');
}
