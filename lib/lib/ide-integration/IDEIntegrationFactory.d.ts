/**
 * IDE Integration Factory
 *
 * This module creates IDE integration instances based on the IDE type.
 */
import { IDEIntegration, IDEIntegrationConfig } from './IDEIntegrationInterface';
export type IDEType = 'cursor' | 'copilot' | 'claude' | 'codeium' | 'tabnine' | 'amazon-q';
export declare class IDEIntegrationFactory {
    /**
     * Create an IDE integration instance
     */
    static create(ideType: IDEType, config: IDEIntegrationConfig): IDEIntegration;
    /**
     * Check if an IDE type is supported
     */
    static isSupported(ideType: IDEType): boolean;
    /**
     * Get all supported IDE types
     */
    static getSupportedTypes(): IDEType[];
}
