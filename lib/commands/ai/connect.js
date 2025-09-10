"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectCommand = void 0;
const cli_1 = require("../../lib/cli");
const ConnectionManager_1 = require("../../lib/ai/ConnectionManager");
exports.connectCommand = (0, cli_1.createCommand)('connect', 'Connect to AI assistant')
    .description('Establish connection to AI coding assistants')
    .argument('<provider>', 'AI provider (cursor, copilot, claude, ollama, gemini, qwen, openai, starcoder, codegeex, codet5, polycoder, mpt-code, a-code)')
    .option('--api-key <key>', 'API key for the provider')
    .option('--model <name>', 'Model name (default based on provider)')
    .option('--base-url <url>', 'Custom base URL for API calls')
    .option('--timeout <ms>', 'Request timeout in milliseconds')
    .action(async (provider, options) => {
    const validProviders = ['cursor', 'copilot', 'claude', 'ollama', 'gemini', 'qwen', 'openai', 'starcoder', 'codegeex', 'codet5', 'polycoder', 'mpt-code', 'a-code'];
    if (!validProviders.includes(provider)) {
        (0, cli_1.cliError)(`Invalid provider: ${provider}`);
        (0, cli_1.info)('Supported providers:');
        validProviders.forEach(p => (0, cli_1.info)(`  • ${p}`));
        process.exit(1);
    }
    try {
        (0, cli_1.info)(`🔌 Connecting to ${provider.toUpperCase()}...`);
        // Check if already connected
        const currentStatus = await ConnectionManager_1.connectionManager.getConnectionStatus(provider);
        if (currentStatus && currentStatus.connected && currentStatus.health === 'healthy') {
            (0, cli_1.warning)(`Already connected to ${provider.toUpperCase()}`);
            (0, cli_1.info)(`Connection health: ${currentStatus.health}`);
            return;
        }
        const result = await ConnectionManager_1.connectionManager.connect(provider, {
            apiKey: options.apiKey,
            model: options.model,
            baseUrl: options.baseUrl,
            timeout: options.timeout ? parseInt(options.timeout) : undefined
        });
        if (result.success) {
            (0, cli_1.success)(`✅ Successfully connected to ${provider.toUpperCase()}!`);
            (0, cli_1.info)(`🤖 AI assistant is ready for collaboration`);
            (0, cli_1.info)(`💡 Try: vibe ai push --help`);
            // Only show API key warning for providers that require API keys
            const providersRequiringApiKey = ['claude', 'gemini', 'openai'];
            if (!options.apiKey && providersRequiringApiKey.includes(provider)) {
                (0, cli_1.warning)(`No API key provided. Connection may fail for actual operations.`);
                (0, cli_1.info)(`💡 Run: vibe ai connect ${provider} --api-key YOUR_KEY`);
            }
        }
        else {
            (0, cli_1.cliError)(`❌ Connection failed: ${result.message}`);
            if (result.error) {
                (0, cli_1.info)(`Error details: ${result.error}`);
            }
            // Show troubleshooting tips
            (0, cli_1.info)(`

🔧 Troubleshooting:`);
            if (provider === 'ollama') {
                (0, cli_1.info)(`  • Make sure Ollama is running locally`);
                (0, cli_1.info)(`  • Start with: ollama serve`);
            }
            else if (provider === 'cursor') {
                (0, cli_1.info)(`  • Make sure Cursor is installed from https://cursor.sh`);
                (0, cli_1.info)(`  • Ensure Cursor is running in VS Code`);
            }
            else if (provider === 'copilot') {
                (0, cli_1.info)(`  • Make sure GitHub Copilot is installed and activated`);
                (0, cli_1.info)(`  • Sign in to GitHub if not already authenticated`);
            }
            else if (provider === 'qwen') {
                (0, cli_1.info)(`  • Make sure Qwen CLI is installed and accessible`);
                (0, cli_1.info)(`  • Check that 'qwen' command is available in your PATH`);
            }
            else if (provider === 'openai') {
                (0, cli_1.info)(`  • Make sure you have a valid OpenAI API key`);
                (0, cli_1.info)(`  • Set OPENAI_API_KEY environment variable or use --api-key option`);
            }
            else if (['starcoder', 'codegeex', 'codet5', 'polycoder', 'mpt-code', 'a-code'].includes(provider)) {
                (0, cli_1.info)(`  • Make sure ${provider} CLI is installed and accessible`);
                (0, cli_1.info)(`  • Check that '${provider}' command is available in your PATH`);
            }
            else {
                (0, cli_1.info)(`  • Check if ${provider} API is accessible`);
                (0, cli_1.info)(`  • Verify your credentials are correct`);
            }
            process.exit(1);
        }
    }
    catch (error) {
        (0, cli_1.cliError)(`💥 Unexpected error during connection: ${error instanceof Error ? error.message : 'Unknown error'}`);
        process.exit(1);
    }
});
