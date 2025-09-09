/**
 * File-based spec templates for different project types
 * Templates are loaded from YAML files in the templates directory
 */
export type TemplateType = string;
export interface Template {
    name: string;
    description: string;
    content: string;
    metadata?: {
        name: string;
        description: string;
        category: string;
        type: string;
        version: string;
        author: string;
        tags: string[];
        dependencies: string[];
        lastUpdated: string;
        compatibleWith: string[];
    };
}
/**
 * Set the template directory path
 */
export declare function setTemplateDirectory(dirPath: string): void;
/**
 * Load template from file and return Template interface
 */
export declare function loadTemplate(templateType: string): Promise<Template | null>;
/**
 * Get all available templates from the templates directory
 */
export declare function getAvailableTemplates(): Promise<Array<{
    type: string;
    name: string;
    description: string;
}>>;
/**
 * Get a template by name (lazy loading)
 */
export declare function getTemplate(type: string): Promise<Template | null>;
export declare const templates: Record<string, Promise<Template | null>>;
