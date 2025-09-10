import { Command } from 'commander';
import { createCommand, success, cliError, info, warning } from '../../lib/cli';
import { connectionManager } from '../../lib/ai/ConnectionManager';
import { AIProvider } from '../../lib/ai/adapters/AdapterInterface';

export const connectCommand = createCommand('connect', 'Connect to AI assistant')
  .description('Establish connection to AI coding assistants')
  .argument('<provider>', 'AI provider (cursor, copilot, claude, ollama, gemini, qwen, openai, starcoder, codegeex, codet5, polycoder, mpt-code, a-code)')
  .option('--api-key <key>', 'API key for the provider')
  .option('--model <name>', 'Model name (default based on provider)')
  .option('--base-url <url>', 'Custom base URL for API calls')
  .option('--timeout <ms>', 'Request timeout in milliseconds')
  .action(async (provider: string, options: any) => {
    const validProviders: AIProvider[] = ['cursor', 'copilot', 'claude', 'ollama', 'gemini', 'qwen', 'openai', 'starcoder', 'codegeex', 'codet5', 'polycoder', 'mpt-code', 'a-code'];

    if (!validProviders.includes(provider as AIProvider)) {
      cliError(`Invalid provider: ${provider}`);
      info('Supported providers:');
      validProviders.forEach(p => info(`  • ${p}`));
      process.exit(1);
    }

    try {
      info(`🔌 Connecting to ${provider.toUpperCase()}...`);

      // Check if already connected
      const currentStatus = await connectionManager.getConnectionStatus(provider as AIProvider);
      if (currentStatus && currentStatus.connected && currentStatus.health === 'healthy') {
        warning(`Already connected to ${provider.toUpperCase()}`);
        info(`Connection health: ${currentStatus.health}`);
        return;
      }

      const result = await connectionManager.connect(provider as AIProvider, {
        apiKey: options.apiKey,
        model: options.model,
        baseUrl: options.baseUrl,
        timeout: options.timeout ? parseInt(options.timeout) : undefined
      });

      if (result.success) {
        success(`✅ Successfully connected to ${provider.toUpperCase()}!`);
        info(`🤖 AI assistant is ready for collaboration`);
        info(`💡 Try: vibe ai push --help`);

        // Only show API key warning for providers that require API keys
        const providersRequiringApiKey = ['claude', 'gemini', 'openai'];
        if (!options.apiKey && providersRequiringApiKey.includes(provider)) {
          warning(`No API key provided. Connection may fail for actual operations.`);
          info(`💡 Run: vibe ai connect ${provider} --api-key YOUR_KEY`);
        }
      } else {
        cliError(`❌ Connection failed: ${result.message}`);
        if (result.error) {
          info(`Error details: ${result.error}`);
        }

        // Show troubleshooting tips
        info(`

🔧 Troubleshooting:`);
        if (provider === 'ollama') {
          info(`  • Make sure Ollama is running locally`);
          info(`  • Start with: ollama serve`);
        } else if (provider === 'cursor') {
          info(`  • Make sure Cursor is installed from https://cursor.sh`);
          info(`  • Ensure Cursor is running in VS Code`);
        } else if (provider === 'copilot') {
          info(`  • Make sure GitHub Copilot is installed and activated`);
          info(`  • Sign in to GitHub if not already authenticated`);
        } else if (provider === 'qwen') {
          info(`  • Make sure Qwen CLI is installed and accessible`);
          info(`  • Check that 'qwen' command is available in your PATH`);
        } else if (provider === 'openai') {
          info(`  • Make sure you have a valid OpenAI API key`);
          info(`  • Set OPENAI_API_KEY environment variable or use --api-key option`);
        } else if (['starcoder', 'codegeex', 'codet5', 'polycoder', 'mpt-code', 'a-code'].includes(provider)) {
          info(`  • Make sure ${provider} CLI is installed and accessible`);
          info(`  • Check that '${provider}' command is available in your PATH`);
        } else {
          info(`  • Check if ${provider} API is accessible`);
          info(`  • Verify your credentials are correct`);
        }

        process.exit(1);
      }

    } catch (error) {
      cliError(`💥 Unexpected error during connection: ${error instanceof Error ? error.message : 'Unknown error'}`);
      process.exit(1);
    }
  });