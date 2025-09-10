import { AIAdapterFactory, AIConfig, AIProvider } from './AdapterInterface';
import { CursorAdapter } from './CursorAdapter';
import { CopilotAdapter } from './CopilotAdapter';
import { ClaudeAdapter } from './ClaudeAdapter';
import { OllamaAdapter } from './OllamaAdapter';
import { GeminiAdapter } from './GeminiAdapter';
import { QwenAdapter } from './QwenAdapter';
import { CLIWrapperAdapter } from './CLIWrapperAdapter';
import { OpenAIAdapter } from './OpenAIAdapter';

/**
 * Factory for creating AI adapters
 * 
 * This factory creates instances of AI adapters based on the provider specified
 * in the configuration.
 */
export class AdapterFactory implements AIAdapterFactory {
  /**
   * Create an AI adapter instance
   */
  create(config: AIConfig): any {
    switch (config.provider) {
      case 'cursor':
        return new CursorAdapter(config);
      case 'copilot':
        return new CopilotAdapter(config);
      case 'claude':
        return new ClaudeAdapter(config);
      case 'ollama':
        return new OllamaAdapter(config);
      case 'gemini':
        return new GeminiAdapter(config);
      case 'qwen':
        return new QwenAdapter(config);
      case 'openai':
        return new OpenAIAdapter(config);
      case 'starcoder':
      case 'codegeex':
      case 'codet5':
      case 'polycoder':
      case 'mpt-code':
      case 'a-code':
        // Use CLI wrapper for these local models
        return new CLIWrapperAdapter(config);
      default:
        throw new Error(`Unsupported AI provider: ${config.provider}`);
    }
  }

  /**
   * Check if this factory supports the given provider
   */
  supports(provider: AIProvider): boolean {
    const supportedProviders: AIProvider[] = [
      'cursor', 'copilot', 'claude', 'ollama', 'gemini', 'qwen', 'openai',
      'starcoder', 'codegeex', 'codet5', 'polycoder', 'mpt-code', 'a-code'
    ];
    return supportedProviders.includes(provider);
  }

  /**
   * Get supported providers by this factory
   */
  getSupportedProviders(): AIProvider[] {
    return [
      'cursor', 'copilot', 'claude', 'ollama', 'gemini', 'qwen', 'openai',
      'starcoder', 'codegeex', 'codet5', 'polycoder', 'mpt-code', 'a-code'
    ];
  }

  /**
   * Get configuration template for a provider
   */
  getConfigTemplate(provider: AIProvider): Partial<AIConfig> {
    switch (provider) {
      case 'cursor':
        return {
          model: 'gpt-4',
          timeout: 30000
        };
      case 'copilot':
        return {
          model: 'gpt-4',
          timeout: 30000
        };
      case 'claude':
        return {
          model: 'claude-2',
          timeout: 30000
        };
      case 'ollama':
        return {
          model: 'llama2',
          baseUrl: 'http://localhost:11434'
        };
      case 'gemini':
        return {
          model: 'gemini-pro',
          timeout: 30000
        };
      case 'qwen':
        return {
          model: 'qwen-max',
          timeout: 30000
        };
      case 'openai':
        return {
          model: 'gpt-3.5-turbo',
          timeout: 30000
        };
      case 'starcoder':
        return {
          model: 'starcoder-base',
          timeout: 30000
        };
      case 'codegeex':
        return {
          model: 'codegeex2-6b',
          timeout: 30000
        };
      case 'codet5':
        return {
          model: 'codet5-base',
          timeout: 30000
        };
      case 'polycoder':
        return {
          model: 'polycoder',
          timeout: 30000
        };
      case 'mpt-code':
        return {
          model: 'mpt-7b-instruct',
          timeout: 30000
        };
      case 'a-code':
        return {
          model: 'a-code-1b',
          timeout: 30000
        };
      default:
        return {};
    }
  }
}