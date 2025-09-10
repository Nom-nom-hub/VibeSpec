"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectCommand = void 0;
const cli_1 = require("../../lib/cli");
const ConnectionManager_1 = require("../../lib/ai/ConnectionManager");
exports.disconnectCommand = (0, cli_1.createCommand)('disconnect', 'Disconnect from AI assistant')
    .description('Terminate connection to AI coding assistants')
    .argument('<provider>', 'AI provider (cursor, copilot, claude, ollama, gemini)')
    .option('--all', 'Disconnect from all connected providers')
    .action(async (provider, options) => {
    if (options.all) {
        // Disconnect from all providers
        const statuses = await ConnectionManager_1.connectionManager.getAllConnectionStatuses();
        const connectedProviders = statuses.filter(s => s.connected).map(s => s.provider);
        if (connectedProviders.length === 0) {
            (0, cli_1.info)('No active AI connections to disconnect.');
            return;
        }
        (0, cli_1.info)(`Disconnecting from ${connectedProviders.length} provider(s)...`);
        for (const provider of connectedProviders) {
            try {
                await ConnectionManager_1.connectionManager.disconnect(provider);
                (0, cli_1.success)(`Disconnected from ${provider.toUpperCase()}`);
            }
            catch (error) {
                (0, cli_1.cliError)(`Failed to disconnect from ${provider.toUpperCase()}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
        (0, cli_1.success)('All AI connections terminated.');
        return;
    }
    // Validate provider
    const validProviders = ['cursor', 'copilot', 'claude', 'ollama', 'gemini'];
    if (!validProviders.includes(provider)) {
        (0, cli_1.cliError)(`Invalid provider: ${provider}`);
        (0, cli_1.info)('Supported providers:');
        validProviders.forEach(p => (0, cli_1.info)(`  • ${p}`));
        process.exit(1);
    }
    try {
        // Check if connected
        const status = await ConnectionManager_1.connectionManager.getConnectionStatus(provider);
        if (!status || !status.connected) {
            (0, cli_1.warning)(`Not currently connected to ${provider.toUpperCase()}`);
            return;
        }
        (0, cli_1.info)(`🔌 Disconnecting from ${provider.toUpperCase()}...`);
        await ConnectionManager_1.connectionManager.disconnect(provider);
        (0, cli_1.success)(`✅ Successfully disconnected from ${provider.toUpperCase()}!`);
        (0, cli_1.info)(`🤖 AI assistant connection terminated`);
    }
    catch (error) {
        (0, cli_1.cliError)(`💥 Unexpected error during disconnection: ${error instanceof Error ? error.message : 'Unknown error'}`);
        process.exit(1);
    }
});
