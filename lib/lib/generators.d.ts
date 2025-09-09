import { VibeSpec } from './spec-parser';
/**
 * Generator function type
 */
export type GeneratorFn = (spec: VibeSpec) => string;
/**
 * Markdown generator for spec.yaml
 */
export declare const generateMarkdown: GeneratorFn;
/**
 * Plain text generator for spec.yaml
 */
export declare const generateText: GeneratorFn;
/**
 * Get generator function by format
 */
export declare const getGenerator: (format: string) => GeneratorFn;
/**
 * Write generated output to file or directory
 */
export declare const writeOutput: (content: string, spec: VibeSpec, outputPath?: string, format?: string) => Promise<void>;
