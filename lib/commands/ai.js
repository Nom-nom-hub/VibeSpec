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
exports.aiCommand = void 0;
const fs = __importStar(require("fs-extra"));
const spec_parser_1 = require("../lib/spec-parser");
const cli_1 = require("../lib/cli");
exports.aiCommand = (0, cli_1.createCommand)('ai', 'Generate AI prompts and context from spec')
    .option('--suggest-missing', 'suggest missing components in the spec')
    .option('--generate-tests', 'generate test suggestions based on features')
    .option('--summarize', 'create concise summary for AI consumption')
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
            (0, cli_1.cliError)('Spec has validation errors that should be fixed first:');
            validation.errors.forEach(error => console.log(`  • ${error}`));
            process.exit(1);
        }
        // Handle different AI prompt types
        if (options.suggestMissing) {
            generateSuggestions(spec, validation);
        }
        else if (options.generateTests) {
            generateTestSuggestions(spec);
        }
        else if (options.summarize) {
            generateSummary(spec);
        }
        else {
            (0, cli_1.cliError)('Please specify one of the AI prompt options:');
            (0, cli_1.cliError)('  --suggest-missing    Show missing components');
            (0, cli_1.cliError)('  --generate-tests     Generate test suggestions');
            (0, cli_1.cliError)('  --summarize          Create AI-ready summary');
            process.exit(1);
        }
    }
    catch (err) {
        (0, cli_1.cliError)(`AI command failed: ${err.message}`);
        process.exit(1);
    }
});
/**
 * Generate suggestions for missing components
 */
function generateSuggestions(spec, validation) {
    console.log('🤖 AI Prompt: Spec Improvement Suggestions\n');
    const suggestions = [];
    if (!spec.goals || spec.goals.length === 0) {
        suggestions.push('Add project goals to provide clear direction and success criteria');
    }
    if (!spec.constraints || spec.constraints.length === 0) {
        suggestions.push('Define project constraints (technical limits, business rules, etc.)');
    }
    if (spec.features && spec.features.length > 0) {
        spec.features.forEach((feature, index) => {
            if (!feature.description) {
                suggestions.push(`Add description to feature "${feature.name}" for clarity`);
            }
            if (!feature.requirements || feature.requirements.length === 0) {
                suggestions.push(`Add specific requirements to feature "${feature.name}"`);
            }
            else if (feature.requirements.length < 3) {
                suggestions.push(`Consider adding more detailed requirements to feature "${feature.name}"`);
            }
            if (!feature.flows || feature.flows.length === 0) {
                suggestions.push(`Add implementation flows to feature "${feature.name}"`);
            }
        });
    }
    console.log('💡 Suggested improvements for AI implementation:\n');
    suggestions.forEach((suggestion, index) => {
        console.log(`${index + 1}. ${suggestion}`);
    });
    if (suggestions.length === 0) {
        console.log('✅ Spec is comprehensive! No major missing components identified.');
    }
    console.log('\n📋 Copy the above suggestions to your AI coding assistant when planning improvements.');
}
/**
 * Generate test suggestions based on features
 */
function generateTestSuggestions(spec) {
    console.log('🧪 AI Prompt: Test Case Generation\n');
    if (!spec.features || spec.features.length === 0) {
        (0, cli_1.cliError)('No features found to generate test suggestions.');
        process.exit(1);
    }
    console.log('Based on the following features, here are test case suggestions:\n');
    spec.features.forEach((feature, index) => {
        console.log(`${index + 1}. ${feature.name}`);
        if (feature.requirements && feature.requirements.length > 0) {
            console.log('   Test scenarios needed:');
            feature.requirements.forEach((req, reqIndex) => {
                const testIdeas = generateTestCases(req);
                testIdeas.forEach(testCase => {
                    console.log(`     ${reqIndex + 1}.${testIdeas.indexOf(testCase) + 1}. ${testCase}`);
                });
            });
        }
        else {
            console.log('   General test categories:');
            console.log('     • Unit tests for core functionality');
            console.log('     • Integration tests with dependencies');
            console.log('     • Error handling and edge cases');
            console.log('     • Performance/load testing');
        }
        console.log('');
    });
    console.log('💡 For AI assistant: Use these test suggestions as a starting point and expand them based on your testing framework and project needs.');
}
/**
 * Generate concise summary for AI consumption
 */
function generateSummary(spec) {
    console.log('📝 AI-Summary Context for Coding Assistant\n');
    console.log('=== PROJECT OVERVIEW ===');
    console.log(`Project: ${spec.project || 'Unnamed Project'}`);
    console.log(`Version: ${spec.version || 'Not specified'}`);
    if (spec.description) {
        console.log(`Description: ${spec.description}`);
    }
    if (spec.goals && spec.goals.length > 0) {
        console.log('\n=== KEY OBJECTIVES ===');
        spec.goals.forEach((goal, index) => {
            console.log(`${index + 1}. ${goal}`);
        });
    }
    if (spec.constraints && spec.constraints.length > 0) {
        console.log('\n=== CONSTRAINTS ===');
        spec.constraints.forEach((constraint, index) => {
            console.log(`• ${constraint}`);
        });
    }
    if (spec.features && spec.features.length > 0) {
        console.log(`\n=== FEATURES (${spec.features.length}) ===`);
        spec.features.forEach((feature, index) => {
            console.log(`Feature ${index + 1}: ${feature.name}`);
            if (feature.description) {
                console.log(`  Description: ${feature.description}`);
            }
            console.log(`  Requirements: ${feature.requirements?.length || 0}`);
            console.log(`  Flows: ${feature.flows?.length || 0}`);
            console.log('');
        });
    }
    console.log('=== IMPLEMENTATION NOTES ===');
    console.log('• Consider the goals when making architecture decisions');
    console.log('• Respect all constraints in the implementation');
    console.log('• Ensure all requirements are covered in the solution');
    console.log('\n💡 Copy this summary to your AI coding assistant for context-aware implementation.');
}
/**
 * Generate test case ideas from a requirement
 */
function generateTestCases(requirement) {
    const testCases = [];
    // Basic positive/negative test patterns
    if (requirement.includes('authentication') || requirement.includes('login')) {
        testCases.push('Test with valid credentials');
        testCases.push('Test with invalid credentials');
        testCases.push('Test locked account scenario');
        testCases.push('Test session timeout');
    }
    else if (requirement.includes('database') || requirement.includes('store')) {
        testCases.push('Test successful data persistence');
        testCases.push('Test database connection failure');
        testCases.push('Test data validation/rejection');
        testCases.push('Test concurrent access scenarios');
    }
    else if (requirement.includes('performance')) {
        testCases.push('Test under normal load');
        testCases.push('Test under heavy load');
        testCases.push('Test memory usage');
        testCases.push('Test response times');
    }
    else {
        // Generic test cases for any requirement
        testCases.push('Test expected behavior');
        testCases.push('Test error conditions');
        testCases.push('Test edge cases');
        testCases.push('Test data validation');
    }
    return testCases;
}
