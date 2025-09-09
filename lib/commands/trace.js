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
exports.traceCommand = void 0;
const fs = __importStar(require("fs-extra"));
const spec_parser_1 = require("../lib/spec-parser");
const cli_1 = require("../lib/cli");
exports.traceCommand = (0, cli_1.createCommand)('trace', 'Show hierarchical mapping of features, flows, and requirements')
    .option('-f, --format <type>', 'output format (table, list)', 'table')
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
        const spec = await (0, spec_parser_1.loadSpec)(specPath);
        const validation = (0, spec_parser_1.validateSpec)(spec);
        if (!validation.valid) {
            (0, cli_1.cliError)('Spec validation failed:');
            validation.errors.forEach(error => console.log(`  • ${error}`));
            process.exit(1);
        }
        if (!spec.features || spec.features.length === 0) {
            (0, cli_1.cliError)('No features found in spec to trace.');
            process.exit(1);
        }
        // Display the hierarchical mapping
        console.log(`${spec.project || 'Unnamed Project'} - Feature Trace\n`);
        if (options.format === 'table') {
            displayTableTrace(spec.features);
        }
        else {
            displayListTrace(spec.features);
        }
        if (validation.warnings && validation.warnings.length > 0) {
            console.log('\n⚠️ Warnings:');
            validation.warnings.forEach(warning => console.log(`  • ${warning}`));
        }
    }
    catch (err) {
        (0, cli_1.cliError)(`Trace failed: ${err.message}`);
        process.exit(1);
    }
});
/**
 * Display trace in table format
 */
function displayTableTrace(features) {
    console.log('| Feature | Flow | Requirements |');
    console.log('|---------|------|--------------|');
    features.forEach((feature, index) => {
        const featureName = feature.name;
        const flowNames = feature.flows?.map(flow => flow.name) || ['(no flows)'];
        const requirements = feature.requirements || ['(no requirements)'];
        // If no flows, show feature directly mapped to requirements
        if (flowNames.length === 1 && flowNames[0] === '(no flows)') {
            console.log(`| ${featureName} | ${flowNames[0]} | ${requirements.join(', ')} |`);
        }
        else {
            // Show each flow on its own row
            flowNames.forEach((flowName, flowIndex) => {
                if (flowIndex === 0) {
                    // First row gets feature name
                    console.log(`| ${featureName} | ${flowName} | ${requirements.slice(0, 2).join(', ')}${requirements.length > 2 ? '...' : ''} |`);
                }
                else {
                    // Subsequent flows get empty feature cell
                    console.log(`| | ${flowName} | ${requirements.slice(0, 2).join(', ')}${requirements.length > 2 ? '...' : ''} |`);
                }
            });
        }
    });
}
/**
 * Display trace in list format
 */
function displayListTrace(features) {
    features.forEach((feature, featureIndex) => {
        console.log(`${featureIndex + 1}. ${feature.name}`);
        if (feature.description) {
            console.log(`   Description: ${feature.description}`);
        }
        // Show requirements directly under feature if no flows
        if (!feature.flows || feature.flows.length === 0) {
            if (feature.requirements && feature.requirements.length > 0) {
                console.log('   Requirements:');
                feature.requirements.forEach((req, reqIndex) => {
                    console.log(`     ${featureIndex + 1}.${reqIndex + 1}. ${req}`);
                });
            }
        }
        else {
            // Show flows with their requirements
            feature.flows.forEach((flow, flowIndex) => {
                console.log(`   ${String.fromCharCode(97 + flowIndex)}) ${flow.name}`);
                if (flow.description) {
                    console.log(`      Description: ${flow.description}`);
                }
                // Show steps if any
                if (flow.steps && flow.steps.length > 0) {
                    console.log('      Steps:');
                    flow.steps.forEach((step, stepIndex) => {
                        console.log(`        ${stepIndex + 1}. ${step}`);
                    });
                }
                // Show requirements under this flow
                if (feature.requirements && feature.requirements.length > 0) {
                    console.log('      Requirements:');
                    feature.requirements.forEach((req, reqIndex) => {
                        console.log(`        ${reqIndex + 1}. ${req}`);
                    });
                }
            });
        }
        console.log('');
    });
}
