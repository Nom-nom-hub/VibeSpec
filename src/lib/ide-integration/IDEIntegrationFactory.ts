/**
 * IDE Integration Factory
 * 
 * This module creates IDE integration instances based on the IDE type.
 */

import { IDEIntegration, IDEIntegrationConfig } from './IDEIntegrationInterface';
import { CursorIDEIntegration } from './CursorIDEIntegration';
import { CopilotIDEIntegration } from './CopilotIDEIntegration';

export type IDEType = 'cursor' | 'copilot' | 'claude' | 'codeium' | 'tabnine' | 'amazon-q';

export class IDEIntegrationFactory {
  /**
   * Create an IDE integration instance
   */
  static create(ideType: IDEType, config: IDEIntegrationConfig): IDEIntegration {
    switch (ideType) {
      case 'cursor':
        return new CursorIDEIntegration(config);
      case 'copilot':
        return new CopilotIDEIntegration(config);
      default:
        throw new Error(`Unsupported IDE type: ${ideType}`);
    }
  }
  
  /**
   * Check if an IDE type is supported
   */
  static isSupported(ideType: IDEType): boolean {
    const supportedTypes: IDEType[] = ['cursor', 'copilot'];
    return supportedTypes.includes(ideType);
  }
  
  /**
   * Get all supported IDE types
   */
  static getSupportedTypes(): IDEType[] {
    return ['cursor', 'copilot'];
  }
}