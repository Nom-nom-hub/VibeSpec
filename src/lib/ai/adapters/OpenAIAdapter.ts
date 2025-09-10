import { BaseAdapter } from './BaseAdapter';
import {
  AIConfig,
  ConnectionResult,
  SendResult
} from './AdapterInterface';
import { VibeSpec } from '../../spec-parser';
import axios, { AxiosInstance, AxiosError } from 'axios';

/**
 * OpenAI Codex Adapter
 * 
 * This adapter provides integration with OpenAI's Codex API for code generation
 * and AI-assisted programming.
 */
export class OpenAIAdapter extends BaseAdapter {
  private axiosInstance: AxiosInstance;
  private apiKey: string;
  private baseUrl: string;
  private model: string;
  private rateLimitResetTime: number | null = null;
  
  constructor(config: AIConfig) {
    super('openai', config);
    this.apiKey = config.apiKey || process.env.OPENAI_API_KEY || '';
    this.baseUrl = config.baseUrl || 'https://api.openai.com/v1';
    this.model = config.model || 'gpt-3.5-turbo';
    
    // Create axios instance with default configuration
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: config.timeout || 30000,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      response => response,
      (error: AxiosError) => {
        if (error.response?.status === 429) {
          // Handle rate limiting
          const resetTime = error.response.headers['x-ratelimit-reset-requests'];
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
          return Promise.reject(new Error('OpenAI server error. Please try again later.'));
        }
        return Promise.reject(error);
      }
    );
  }
  
  /**
   * Establish connection to OpenAI Codex
   */
  async connect(config: AIConfig): Promise<ConnectionResult> {
    try {
      // Check if API key is provided
      if (!this.apiKey) {
        return {
          success: false,
          message: 'API key is required for OpenAI Codex. Please provide an API key or set OPENAI_API_KEY environment variable.',
          error: 'Missing API key'
        };
      }
      
      // Test the connection with a simple API call
      await this.axiosInstance.get('/models');
      
      this.connected = true;
      this.health = 'healthy';
      this.lastActivity = new Date();
      
      return {
        success: true,
        message: 'Connected to OpenAI Codex',
        credentials: {
          provider: 'openai',
          scopes: ['read', 'write', 'chat']
        }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        message: `Failed to connect to OpenAI Codex: ${errorMessage}`,
        error: errorMessage
      };
    }
  }
  
  /**
   * Send specification to OpenAI Codex
   */
  async sendSpec(spec: VibeSpec, options?: { optimize?: boolean; format?: string }): Promise<SendResult> {
    if (!this.connected) {
      throw new Error('Not connected to OpenAI Codex');
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
      // Prepare the prompt for OpenAI
      const prompt = this.generatePrompt(spec, options);
      
      // Prepare the API request
      const requestBody = {
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an AI coding assistant that helps developers implement software projects based on specifications.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      };
      
      // Record start time for processing time calculation
      const startTime = Date.now();
      
      // Make the API call
      const response = await this.axiosInstance.post('/chat/completions', requestBody);
      
      const processingTime = Date.now() - startTime;
      
      this.lastActivity = new Date();
      
      return {
        success: true,
        messageId: response.data.id,
        estimatedTokens: response.data.usage?.total_tokens || prompt.length / 4,
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
   * Generate a prompt for OpenAI based on the spec
   */
  private generatePrompt(spec: VibeSpec, options?: { optimize?: boolean; format?: string }): string {
    let prompt = `You are an AI coding assistant working on a software project.\n\n`;
    
    prompt += `Project: ${spec.project || 'Untitled Project'}\n`;
    if (spec.version) {
      prompt += `Version: ${spec.version}\n`;
    }
    if (spec.description) {
      prompt += `Description: ${spec.description}\n`;
    }
    
    if (spec.goals && spec.goals.length > 0) {
      prompt += `\nProject Goals:\n`;
      spec.goals.forEach((goal, index) => {
        prompt += `${index + 1}. ${goal}\n`;
      });
    }
    
    if (spec.constraints && spec.constraints.length > 0) {
      prompt += `\nConstraints:\n`;
      spec.constraints.forEach((constraint, index) => {
        prompt += `- ${constraint}\n`;
      });
    }
    
    if (spec.features && spec.features.length > 0) {
      prompt += `\nFeatures to Implement:\n`;
      spec.features.forEach((feature, featureIndex) => {
        prompt += `\n${featureIndex + 1}. ${feature.name}\n`;
        if (feature.description) {
          prompt += `   Description: ${feature.description}\n`;
        }
        
        if (feature.requirements && feature.requirements.length > 0) {
          prompt += `   Requirements:\n`;
          feature.requirements.forEach((req, reqIndex) => {
            prompt += `   ${reqIndex + 1}. ${req}\n`;
          });
        }
      });
    }
    
    if (options?.optimize) {
      prompt += `\nPlease optimize the implementation for performance and readability.`;
    }
    
    if (options?.format) {
      prompt += `\nPlease format the response in ${options.format}.`;
    }
    
    prompt += `\n\nPlease help implement this project according to the specifications above. Provide code examples and implementation guidance.`;
    
    return prompt;
  }
}