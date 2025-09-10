import { createCommand, success, cliError, info, warning } from '../../lib/cli';
import { connectionManager } from '../../lib/ai/ConnectionManager';
import { AIProvider } from '../../lib/ai/adapters/AdapterInterface';

export const disconnectCommand = createCommand('disconnect', 'Disconnect from AI assistant')
  .description('Terminate connection to AI coding assistants')
  .argument('<provider>', 'AI provider (cursor, copilot, claude, ollama, gemini)')
  .option('--all', 'Disconnect from all connected providers')
  .action(async (provider: string, options) => {
    if (options.all) {
      // Disconnect from all providers
      const statuses = await connectionManager.getAllConnectionStatuses();
      const connectedProviders = statuses.filter(s => s.connected).map(s => s.provider);
      
      if (connectedProviders.length === 0) {
        info('No active AI connections to disconnect.');
        return;
      }
      
      info(`Disconnecting from ${connectedProviders.length} provider(s)...`);
      
      for (const provider of connectedProviders) {
        try {
          await connectionManager.disconnect(provider as AIProvider);
          success(`Disconnected from ${provider.toUpperCase()}`);
        } catch (error) {
          cliError(`Failed to disconnect from ${provider.toUpperCase()}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
      
      success('All AI connections terminated.');
      return;
    }
    
    // Validate provider
    const validProviders: AIProvider[] = ['cursor', 'copilot', 'claude', 'ollama', 'gemini'];
    if (!validProviders.includes(provider as AIProvider)) {
      cliError(`Invalid provider: ${provider}`);
      info('Supported providers:');
      validProviders.forEach(p => info(`  • ${p}`));
      process.exit(1);
    }
    
    try {
      // Check if connected
      const status = await connectionManager.getConnectionStatus(provider as AIProvider);
      if (!status || !status.connected) {
        warning(`Not currently connected to ${provider.toUpperCase()}`);
        return;
      }
      
      info(`🔌 Disconnecting from ${provider.toUpperCase()}...`);
      
      await connectionManager.disconnect(provider as AIProvider);
      
      success(`✅ Successfully disconnected from ${provider.toUpperCase()}!`);
      info(`🤖 AI assistant connection terminated`);
    } catch (error) {
      cliError(`💥 Unexpected error during disconnection: ${error instanceof Error ? error.message : 'Unknown error'}`);
      process.exit(1);
    }
  });