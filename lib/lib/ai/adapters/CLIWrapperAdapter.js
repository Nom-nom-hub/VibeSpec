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
exports.CLIWrapperAdapter = void 0;
const BaseAdapter_1 = require("./BaseAdapter");
const child_process_1 = require("child_process");
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
/**
 * CLI Wrapper Adapter
 *
 * This adapter provides a generic wrapper for CLI-based AI models that can be
 * run from the command line. It works with models like StarCoder, CodeGeeX, etc.
 */
class CLIWrapperAdapter extends BaseAdapter_1.BaseAdapter {
    constructor(config) {
        super(config.provider, config);
        this.modelName = config.model || 'default';
        this.tempDir = path.join(os.tmpdir(), `vibespec-${config.provider}`);
    }
    /**
     * Establish connection to CLI-based AI model
     */
    async connect(config) {
        try {
            // Check if the CLI tool is installed and accessible
            const isCLIAvailable = await this.checkCLIInstallation();
            if (!isCLIAvailable) {
                return {
                    success: false,
                    message: `${this.provider} CLI is not installed or not accessible. Please install the ${this.provider} CLI tool.`,
                    error: `${this.provider} CLI not found`
                };
            }
            // Ensure temp directory exists
            await fs.ensureDir(this.tempDir);
            // For CLI wrappers, we don't need an API key since they run locally
            this.connected = true;
            this.health = 'healthy';
            this.lastActivity = new Date();
            return {
                success: true,
                message: `Connected to ${this.provider} CLI`,
                credentials: {
                    provider: this.provider,
                    scopes: ['read', 'write', 'chat']
                }
            };
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to connect to ${this.provider} CLI: ${error instanceof Error ? error.message : 'Unknown error'}`,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    /**
     * Check if the CLI tool is installed and accessible
     */
    async checkCLIInstallation() {
        // For generic CLI wrapper, we'll check if the provider name is a valid command
        const command = this.provider;
        return new Promise((resolve) => {
            const cliProcess = (0, child_process_1.spawn)(command, ['--help'], { timeout: 5000 });
            cliProcess.on('close', (code) => {
                resolve(code === 0);
            });
            cliProcess.on('error', () => {
                resolve(false);
            });
        });
    }
    /**
     * Send specification to CLI-based AI model
     */
    async sendSpec(spec, options) {
        if (!this.connected) {
            throw new Error(`Not connected to ${this.provider} CLI`);
        }
        try {
            // Create a temporary file with the spec content
            const tempFile = path.join(this.tempDir, `spec-${Date.now()}.json`);
            await fs.writeJson(tempFile, spec, { spaces: 2 });
            // Prepare the prompt for the AI model
            const prompt = this.generatePrompt(spec, options);
            // Create a temporary prompt file
            const promptFile = path.join(this.tempDir, `prompt-${Date.now()}.txt`);
            await fs.writeFile(promptFile, prompt, 'utf8');
            // Run the CLI tool with the prompt
            const result = await this.runCLI(promptFile);
            // Clean up temporary files
            await fs.remove(tempFile);
            await fs.remove(promptFile);
            this.lastActivity = new Date();
            return {
                success: true,
                messageId: `${this.provider}-${Date.now()}`,
                estimatedTokens: prompt.length, // Approximate token count
                processingTime: result.processingTime,
                warnings: result.warnings
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    /**
     * Run the CLI tool with a prompt file
     */
    async runCLI(promptFile) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            let output = '';
            let errors = '';
            const warnings = [];
            // Run the CLI tool with the prompt file
            // The command format will depend on the specific tool
            let command = this.provider;
            let args = [];
            // Handle different CLI tools with their specific arguments
            switch (this.provider) {
                case 'starcoder':
                    args = ['--file', promptFile, '--model', this.modelName];
                    break;
                case 'codegeex':
                    args = ['--input', promptFile, '--model', this.modelName];
                    break;
                default:
                    // Generic approach
                    args = ['--file', promptFile];
            }
            const cliProcess = (0, child_process_1.spawn)(command, args, {
                timeout: 30000 // 30 second timeout
            });
            cliProcess.stdout.on('data', (data) => {
                output += data.toString();
            });
            cliProcess.stderr.on('data', (data) => {
                errors += data.toString();
            });
            cliProcess.on('close', (code) => {
                const processingTime = Date.now() - startTime;
                if (code === 0) {
                    resolve({
                        output,
                        processingTime,
                        warnings: errors ? [errors] : undefined
                    });
                }
                else {
                    reject(new Error(`${this.provider} CLI exited with code ${code}: ${errors}`));
                }
            });
            cliProcess.on('error', (error) => {
                reject(new Error(`Failed to start ${this.provider} CLI: ${error.message}`));
            });
        });
    }
    /**
     * Generate a prompt for the AI model based on the spec
     */
    generatePrompt(spec, options) {
        let prompt = `You are an AI coding assistant working on a software project.

`;
        prompt += `Project: ${spec.project || 'Untitled Project'}
`;
        if (spec.version) {
            prompt += `Version: ${spec.version}
`;
        }
        if (spec.description) {
            prompt += `Description: ${spec.description}
`;
        }
        if (spec.goals && spec.goals.length > 0) {
            prompt += `
Project Goals:
`;
            spec.goals.forEach((goal, index) => {
                prompt += `${index + 1}. ${goal}
`;
            });
        }
        if (spec.constraints && spec.constraints.length > 0) {
            prompt += `
Constraints:
`;
            spec.constraints.forEach((constraint, index) => {
                prompt += `- ${constraint}
`;
            });
        }
        if (spec.features && spec.features.length > 0) {
            prompt += `
Features to Implement:
`;
            spec.features.forEach((feature, featureIndex) => {
                prompt += `
${featureIndex + 1}. ${feature.name}
`;
                if (feature.description) {
                    prompt += `   Description: ${feature.description}
`;
                }
                if (feature.requirements && feature.requirements.length > 0) {
                    prompt += `   Requirements:
`;
                    feature.requirements.forEach((req, reqIndex) => {
                        prompt += `   ${reqIndex + 1}. ${req}
`;
                    });
                }
            });
        }
        if (options?.optimize) {
            prompt += `
Please optimize the implementation for performance and readability.`;
        }
        if (options?.format) {
            prompt += `
Please format the response in ${options.format}.`;
        }
        prompt += `

Please help implement this project according to the specifications above.`;
        return prompt;
    }
}
exports.CLIWrapperAdapter = CLIWrapperAdapter;
