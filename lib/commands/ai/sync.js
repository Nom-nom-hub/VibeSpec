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
exports.syncCommand = void 0;
const cli_1 = require("../../lib/cli");
const ConnectionManager_1 = require("../../lib/ai/ConnectionManager");
const spec_parser_1 = require("../../lib/spec-parser");
const fs = __importStar(require("fs-extra"));
exports.syncCommand = (0, cli_1.createCommand)('sync', 'Sync specification with AI assistant')
    .description('Synchronize current specification with connected AI assistant')
    .argument('[provider]', 'AI provider (cursor, copilot, claude, ollama, gemini, qwen)')
    .option('--file <path>', 'Path to spec file', 'spec.yaml')
    .option('--all', 'Sync with all connected providers')
    .option('--force', 'Force sync even if no changes detected')
    .action(async (provider, options) => {
    // Load spec file
    const specPath = options.file;
    let spec;
    try {
        const exists = await fs.pathExists(specPath);
        if (!exists) {
            (0, cli_1.cliError)(`Spec file not found: ${specPath}`);
            (0, cli_1.cliError)('Use "vibe init" to create a spec.yaml file first.');
            process.exit(1);
        }
        spec = await (0, spec_parser_1.loadSpec)(specPath);
    }
    catch (error) {
        (0, cli_1.cliError)(`Failed to load spec file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        process.exit(1);
    }
    if (options.all) {
        // Sync with all connected providers
        const statuses = await ConnectionManager_1.connectionManager.getAllConnectionStatuses();
        const connectedProviders = statuses.filter(s => s.connected).map(s => s.provider);
        if (connectedProviders.length === 0) {
            (0, cli_1.info)('No active AI connections. Please connect to an AI provider first.');
            (0, cli_1.info)('Use: vibe ai connect <provider>');
            return;
        }
        (0, cli_1.info)(`Syncing with ${connectedProviders.length} provider(s)...`);
        let successCount = 0;
        for (const provider of connectedProviders) {
            try {
                await syncWithProvider(provider, spec, options);
                successCount++;
            }
            catch (error) {
                (0, cli_1.cliError)(`Failed to sync with ${provider.toUpperCase()}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
        if (successCount > 0) {
            (0, cli_1.success)(`Successfully synced with ${successCount} provider(s)!`);
        }
        return;
    }
    // Validate provider if specified
    if (provider) {
        const validProviders = ['cursor', 'copilot', 'claude', 'ollama', 'gemini', 'qwen'];
        if (!validProviders.includes(provider)) {
            (0, cli_1.cliError)(`Invalid provider: ${provider}`);
            (0, cli_1.info)('Supported providers:');
            validProviders.forEach(p => (0, cli_1.info)(`  • ${p}`));
            process.exit(1);
        }
        // Check if connected
        const status = await ConnectionManager_1.connectionManager.getConnectionStatus(provider);
        if (!status || !status.connected) {
            (0, cli_1.cliError)(`Not connected to ${provider.toUpperCase()}. Please connect first.`);
            (0, cli_1.info)('Use: vibe ai connect ' + provider);
            process.exit(1);
        }
        try {
            await syncWithProvider(provider, spec, options);
            (0, cli_1.success)(`✅ Successfully synced with ${provider.toUpperCase()}!`);
        }
        catch (error) {
            (0, cli_1.cliError)(`Failed to sync with ${provider.toUpperCase()}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            process.exit(1);
        }
    }
    else {
        // No provider specified, show help
        (0, cli_1.info)('Please specify an AI provider or use --all to sync with all connected providers.');
        (0, cli_1.info)('Examples:');
        (0, cli_1.info)('  vibe ai sync cursor');
        (0, cli_1.info)('  vibe ai sync --all');
        process.exit(1);
    }
});
async function syncWithProvider(provider, spec, options) {
    (0, cli_1.info)(`🔄 Syncing specification with ${provider.toUpperCase()}...`);
    try {
        // Send spec to provider
        const result = await ConnectionManager_1.connectionManager.sendSpecToProvider(provider, spec);
        if (result.success) {
            (0, cli_1.success)(`Specification sent to ${provider.toUpperCase()} successfully!`);
            if (result.messageId) {
                (0, cli_1.info)(`Message ID: ${result.messageId}`);
            }
            if (result.estimatedTokens) {
                (0, cli_1.info)(`Estimated tokens: ${result.estimatedTokens}`);
            }
        }
        else {
            throw new Error(result.error || 'Unknown error during sync');
        }
    }
    catch (error) {
        throw error;
    }
}
