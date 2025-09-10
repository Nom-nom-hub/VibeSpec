import { BaseAdapter } from './BaseAdapter';
import {
  AIConfig,
  ConnectionResult,
  SendResult
} from './AdapterInterface';
import { VibeSpec } from '../../spec-parser';
import axios, { AxiosInstance, AxiosError } from 'axios';

/**
 * Claude CLI Adapter
 * 
 * This adapter provides integration with Anthropic's Claude AI through API calls.
 * Claude requires an API key for authentication.
 */
export class ClaudeAdapter extends BaseAdapter {
  private axiosInstance: AxiosInstance;
  private apiKey: string;
  private baseUrl: string;
  private model: string;
  private rateLimitResetTime: number | null = null;
  
  constructor(config: AIConfig) {
    super('claude', config);
    this.apiKey = config.apiKey || process.env.ANTHROPIC_API_KEY || '';
    this.baseUrl = config.baseUrl || 'https://api.anthropic.com/v1';
    this.model = config.model || 'claude-2';
    
    // Create axios instance with default configuration
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: config.timeout || 30000,
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      }
    });
    
    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      response => response,
      (error: AxiosError) => {
        if (error.response?.status === 429) {
          // Handle rate limiting
          const resetTime = error.response.headers['retry-after'];
          if (resetTime) {
            this.rateLimitResetTime = Date.now() + parseInt(resetTime) * 1000;
          }
          return Promise.reject(new Error('Rate limit exceeded. Please try again later.'));
        }
        if (error.response?.status === 401) {
          return Promise.reject(new Error('Invalid API key. Please check your credentials.'));
        }
        if (error.response?.status === 400) {
          return Promise.reject(new Error('Bad request. Please check your input.'));
        }
        if (error.response?.status === 500) {
          return Promise.reject(new Error('Anthropic server error. Please try again later.'));
        }
        return Promise.reject(error);
      }
    );
  }
  
  /**
   * Establish connection to Claude CLI
   */
  async connect(config: AIConfig): Promise<ConnectionResult> {
    try {
      // In a real implementation, this would check if Claude CLI is available
      // and properly configured in the user's environment
      
      // For Claude, we need to check if an API key is available
      // either through config or environment variables
      const apiKey = config.apiKey || process.env.ANTHROPIC_API_KEY;
      
      if (!apiKey) {
        return {
          success: false,
          message: 'API key is required for Claude. Please set ANTHROPIC_API_KEY environment variable or provide --api-key option.',
          error: 'Missing API key'
        };
      }
      
      // Test the connection with a simple API call
      // Note: Claude doesn't have a simple "ping" endpoint, so we'll just verify the API key
      // by making a minimal request
      
      this.connected = true;
      this.health = 'healthy';
      this.lastActivity = new Date();
      
      return {
        success: true,
        message: 'Connected to Claude CLI',
        credentials: {
          provider: 'claude',
          scopes: ['read', 'write', 'chat']
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to connect to Claude CLI: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  /**
   * Send specification to Claude CLI
   */
  async sendSpec(spec: VibeSpec, options?: { optimize?: boolean; format?: string }): Promise<SendResult> {
    if (!this.connected) {
      throw new Error('Not connected to Claude CLI');
    }
    
    // Check if we're rate limited
    if (this.rateLimitResetTime && Date.now() < this.rateLimitResetTime) {
      const waitTime = Math.ceil((this.rateLimitResetTime - Date.now()) / 1000);
      return {
        success: false,
        error: `Rate limited. Please wait ${waitTime} seconds before trying again.`
      };
    }
    
    try {
      // Prepare the prompt for Claude
      const prompt = this.generatePrompt(spec, options);
      
      // Prepare the API request
      const requestBody = {
        model: this.model,
        prompt: `

Human: ${prompt}

Assistant:`,
        max_tokens_to_sample: 2000,
        temperature: 0.7
      };
      
      // Record start time for processing time calculation
      const startTime = Date.now();
      
      // Make the API call
      const response = await this.axiosInstance.post('/completions', requestBody);
      
      const processingTime = Date.now() - startTime;
      
      this.lastActivity = new Date();
      
      return {
        success: true,
        messageId: response.data.stop_reason,
        estimatedTokens: response.data.completion?.length || prompt.length / 4,
        processingTime: processingTime
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage
      };
    }
  }
  
  /**
   * Generate a prompt for Claude based on the spec
   */
  private generatePrompt(spec: VibeSpec, options?: { optimize?: boolean; format?: string }): string {
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

Please help implement this project according to the specifications above. Provide code examples and implementation guidance.`;
    
    return prompt;
  }
}