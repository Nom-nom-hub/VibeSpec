"use strict";
/**
 * Cursor IDE Integration
 *
 * This module provides integration with the Cursor VS Code extension
 * by creating context files that Cursor can read and use for AI assistance.
 */
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
exports.CursorIDEIntegration = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const IDEIntegrationInterface_1 = require("./IDEIntegrationInterface");
/**
 * Cursor IDE Integration
 *
 * Cursor can read context from special files in the project.
 * This integration creates those files with VibeSpec information.
 */
class CursorIDEIntegration extends IDEIntegrationInterface_1.IDEIntegration {
    constructor(config) {
        super(config);
        this.watchInterval = null;
        this.contextFilePath = path.join(this.getContextDir(), 'cursor-context.md');
    }
    /**
     * Initialize Cursor IDE integration
     */
    async initialize() {
        await this.ensureContextDir();
        // Start watching for changes if requested
        if (this.config.watchChanges) {
            this.startWatching();
        }
    }
    /**
     * Create context for Cursor
     */
    async createContext(spec) {
        const context = {
            project: {
                name: spec.project || 'Untitled Project',
                version: spec.version,
                description: spec.description
            },
            goals: spec.goals || [],
            constraints: spec.constraints || [],
            features: (spec.features || []).map(feature => ({
                name: feature.name,
                description: feature.description,
                requirements: feature.requirements || [],
                flows: (feature.flows || []).map(flow => ({
                    name: flow.name,
                    description: flow.description,
                    steps: flow.steps || []
                }))
            })),
            implementation: {
                cwd: process.cwd(),
                recentFiles: []
            },
            aiInstructions: {
                guidelines: [
                    'Follow the specification exactly as described',
                    'Ask for clarification if requirements are unclear',
                    'Focus on implementing one feature at a time',
                    'Write clean, well-documented code',
                    'Follow established project patterns and conventions'
                ],
                doNotDo: {
                    do: [
                        'Implement features as specified',
                        'Ask questions when uncertain',
                        'Write tests for new functionality',
                        'Document complex logic',
                        'Follow security best practices'
                    ],
                    dont: [
                        'Skip requirements or implementation steps',
                        'Ignore error handling',
                        'Write overly complex solutions',
                        'Deviate from the specification without discussion'
                    ]
                },
                patterns: [
                    'Use modular, reusable components',
                    'Follow established naming conventions',
                    'Implement proper error handling',
                    'Write self-documenting code'
                ]
            }
        };
        this.context = context;
        return context;
    }
    /**
     * Write context to Cursor-specific files
     */
    async writeContext(context) {
        await this.ensureContextDir();
        // Create a markdown file with context information
        const content = this.generateContextMarkdown(context);
        await fs.writeFile(this.contextFilePath, content, 'utf8');
        // Also create a JSON version for programmatic access
        const jsonContextPath = path.join(this.getContextDir(), 'cursor-context.json');
        await fs.writeJson(jsonContextPath, context, { spaces: 2 });
    }
    /**
     * Update context with changes
     */
    async updateContext(changes) {
        if (!this.context) {
            throw new Error('Context not initialized. Call createContext first.');
        }
        // Merge changes into existing context
        this.context = { ...this.context, ...changes };
        // Write updated context
        await this.writeContext(this.context);
    }
    /**
     * Cleanup resources
     */
    async cleanup() {
        if (this.watchInterval) {
            clearInterval(this.watchInterval);
            this.watchInterval = null;
        }
    }
    /**
     * Start watching for file changes
     */
    startWatching() {
        this.watchInterval = setInterval(async () => {
            // In a real implementation, this would monitor project files
            // and update the context with recent changes
            if (this.context) {
                // Simulate updating recent files
                const updatedContext = { ...this.context };
                updatedContext.implementation.recentFiles = this.getRecentFiles();
                await this.updateContext(updatedContext);
            }
        }, 5000); // Check every 5 seconds
    }
    /**
     * Get recently modified files
     */
    getRecentFiles() {
        // In a real implementation, this would scan the project directory
        // and return recently modified files
        return [];
    }
    /**
     * Generate markdown content for Cursor context
     */
    generateContextMarkdown(context) {
        let content = `# VibeSpec Context for Cursor AI

`;
        content += `## Project Information
`;
        content += `- **Name**: ${context.project.name}
`;
        if (context.project.version) {
            content += `- **Version**: ${context.project.version}
`;
        }
        if (context.project.description) {
            content += `- **Description**: ${context.project.description}
`;
        }
        content += `
`;
        if (context.goals.length > 0) {
            content += `## Project Goals
`;
            context.goals.forEach((goal, index) => {
                content += `${index + 1}. ${goal}
`;
            });
            content += `
`;
        }
        if (context.constraints.length > 0) {
            content += `## Constraints
`;
            context.constraints.forEach((constraint, index) => {
                content += `- ${constraint}
`;
            });
            content += `
`;
        }
        if (context.features.length > 0) {
            content += `## Features
`;
            context.features.forEach((feature, featureIndex) => {
                content += `### ${feature.name}
`;
                if (feature.description) {
                    content += `${feature.description}

`;
                }
                if (feature.requirements.length > 0) {
                    content += `**Requirements:**
`;
                    feature.requirements.forEach((req, reqIndex) => {
                        content += `${reqIndex + 1}. ${req}
`;
                    });
                    content += `
`;
                }
                if (feature.flows && feature.flows.length > 0) {
                    content += `**Implementation Flows:**
`;
                    feature.flows.forEach((flow, flowIndex) => {
                        content += `${flowIndex + 1}. **${flow.name}**: ${flow.description || ''}
`;
                        if (flow.steps && flow.steps.length > 0) {
                            flow.steps.forEach((step, stepIndex) => {
                                content += `   - ${step}
`;
                            });
                        }
                    });
                    content += `
`;
                }
            });
        }
        if (context.aiInstructions) {
            content += `## AI Assistant Guidelines
`;
            if (context.aiInstructions.guidelines) {
                content += `### General Guidelines
`;
                context.aiInstructions.guidelines.forEach(guideline => {
                    content += `- ${guideline}
`;
                });
                content += `
`;
            }
            if (context.aiInstructions.doNotDo) {
                content += `### Do's and Don'ts
`;
                content += `**Do:**
`;
                context.aiInstructions.doNotDo.do.forEach(item => {
                    content += `- ${item}
`;
                });
                content += `
`;
                content += `**Don't:**
`;
                context.aiInstructions.doNotDo.dont.forEach(item => {
                    content += `- ${item}
`;
                });
                content += `
`;
            }
            if (context.aiInstructions.patterns) {
                content += `### Preferred Patterns
`;
                context.aiInstructions.patterns.forEach(pattern => {
                    content += `- ${pattern}
`;
                });
                content += `
`;
            }
        }
        content += `## Implementation Context
`;
        content += `- **Current Directory**: ${context.implementation.cwd}
`;
        content += `
`;
        content += `> This context was generated by VibeSpec to help AI assistants understand the project requirements and constraints.

`;
        return content;
    }
}
exports.CursorIDEIntegration = CursorIDEIntegration;
