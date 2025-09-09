export interface VibeSpec {
    project?: string;
    version?: string;
    description?: string;
    goals?: string[];
    features?: VibeFeature[];
    constraints?: string[];
}
export interface VibeFeature {
    name: string;
    description?: string;
    requirements?: string[];
    flows?: VibeFlow[];
}
export interface VibeFlow {
    name: string;
    description?: string;
    steps?: string[];
}
/**
 * Load and parse a spec file (YAML/JSON/Markdown)
 */
export declare function loadSpec(filePath: string): Promise<VibeSpec>;
/**
 * Validate spec structure against expected format
 */
export declare function validateSpec(spec: VibeSpec): {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
/**
 * Generate spec from plain text description using AI assistance
 */
export declare function generateSpecFromText(text: string, aiAdapter?: string): Promise<VibeSpec>;
