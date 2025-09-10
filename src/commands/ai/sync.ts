import { createCommand, success, cliError, info, warning } from '../../lib/cli';
import { connectionManager } from '../../lib/ai/ConnectionManager';
import { AIProvider } from '../../lib/ai/adapters/AdapterInterface';
import { loadSpec } from '../../lib/spec-parser';
import * as fs from 'fs-extra';

export const syncCommand = createCommand('sync', 'Sync specification with AI assistant')
  .description('Synchronize current specification with connected AI assistant')
  .argument('[provider]', 'AI provider (cursor, copilot, claude, ollama, gemini, qwen)')
  .option('--file <path>', 'Path to spec file', 'spec.yaml')
  .option('--all', 'Sync with all connected providers')
  .option('--force', 'Force sync even if no changes detected')
  .action(async (provider: string, options: any) => {
    // Load spec file
    const specPath = options.file;
    let spec: any;
    
    try {
      const exists = await fs.pathExists(specPath);
      if (!exists) {
        cliError(`Spec file not found: ${specPath}`);
        cliError('Use "vibe init" to create a spec.yaml file first.');
        process.exit(1);
      }
      
      spec = await loadSpec(specPath);
    } catch (error) {
      cliError(`Failed to load spec file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      process.exit(1);
    }
    
    if (options.all) {
      // Sync with all connected providers
      const statuses = await connectionManager.getAllConnectionStatuses();
      const connectedProviders = statuses.filter(s => s.connected).map(s => s.provider);
      
      if (connectedProviders.length === 0) {
        info('No active AI connections. Please connect to an AI provider first.');
        info('Use: vibe ai connect <provider>');
        return;
      }
      
      info(`Syncing with ${connectedProviders.length} provider(s)...`);
      
      let successCount = 0;
      for (const provider of connectedProviders) {
        try {
          await syncWithProvider(provider as AIProvider, spec, options);
          successCount++;
        } catch (error) {
          cliError(`Failed to sync with ${provider.toUpperCase()}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
      
      if (successCount > 0) {
        success(`Successfully synced with ${successCount} provider(s)!`);
      }
      return;
    }
    
    // Validate provider if specified
    if (provider) {
      const validProviders: AIProvider[] = ['cursor', 'copilot', 'claude', 'ollama', 'gemini', 'qwen'];
      if (!validProviders.includes(provider as AIProvider)) {
        cliError(`Invalid provider: ${provider}`);
        info('Supported providers:');
        validProviders.forEach(p => info(`  • ${p}`));
        process.exit(1);
      }
      
      // Check if connected
      const status = await connectionManager.getConnectionStatus(provider as AIProvider);
      if (!status || !status.connected) {
        cliError(`Not connected to ${provider.toUpperCase()}. Please connect first.`);
        info('Use: vibe ai connect ' + provider);
        process.exit(1);
      }
      
      try {
        await syncWithProvider(provider as AIProvider, spec, options);
        success(`✅ Successfully synced with ${provider.toUpperCase()}!`);
      } catch (error) {
        cliError(`Failed to sync with ${provider.toUpperCase()}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        process.exit(1);
      }
    } else {
      // No provider specified, show help
      info('Please specify an AI provider or use --all to sync with all connected providers.');
      info('Examples:');
      info('  vibe ai sync cursor');
      info('  vibe ai sync --all');
      process.exit(1);
    }
  });

async function syncWithProvider(provider: AIProvider, spec: any, options: any) {
  info(`🔄 Syncing specification with ${provider.toUpperCase()}...`);
  
  try {
    // Send spec to provider
    const result = await connectionManager.sendSpecToProvider(provider, spec);
    
    if (result.success) {
      success(`Specification sent to ${provider.toUpperCase()} successfully!`);
      if (result.messageId) {
        info(`Message ID: ${result.messageId}`);
      }
      if (result.estimatedTokens) {
        info(`Estimated tokens: ${result.estimatedTokens}`);
      }
    } else {
      throw new Error(result.error || 'Unknown error during sync');
    }
  } catch (error) {
    throw error;
  }
}