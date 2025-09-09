/**
 * File-based spec templates for different project types
 * Templates are loaded from YAML files in the templates directory
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import * as yaml from 'js-yaml';

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

// Cache for loaded templates
let templatesCache: Map<string, TemplateFile> = new Map();
let lastCacheRefresh = 0;
const CACHE_TTL = 30000; // 30 seconds

interface TemplateFile {
  metadata: Template['metadata'];
  templateConfig: {
    generateFrom: string;
    variables: any[];
  };
  content: string;
}

// Default template directory (can be overridden to use ~/.vibespec/templates/)
let templateDir = path.join(__dirname, '../../templates');

/**
 * Set the template directory path
 */
export function setTemplateDirectory(dirPath: string): void {
  templateDir = dirPath;
  // Clear cache when directory changes
  templatesCache = new Map();
  lastCacheRefresh = 0;
}

/**
 * Load a template from YAML file
 */
async function loadTemplateFile(templateType: string): Promise<TemplateFile> {
  const templatePath = path.join(templateDir, `${templateType}.yaml`);

  // Check cache first
  const now = Date.now();
  if (templatesCache.has(templatePath) && now - lastCacheRefresh < CACHE_TTL) {
    return templatesCache.get(templatePath)!;
  }

  // Load and parse template file
  const fileContent = await fs.readFile(templatePath, 'utf8');
  const templateData = yaml.load(fileContent) as any;

  const templateFile: TemplateFile = {
    metadata: templateData.metadata,
    templateConfig: templateData.templateConfig,
    content: templateData.content
  };

  // Cache the template
  templatesCache.set(templatePath, templateFile);
  lastCacheRefresh = now;

  return templateFile;
}

/**
 * Load template from file and return Template interface
 */
export async function loadTemplate(templateType: string): Promise<Template | null> {
  try {
    const templateFile = await loadTemplateFile(templateType);

    return {
      name: templateFile.metadata?.name || templateType,
      description: templateFile.metadata?.description || `Template for ${templateType}`,
      content: templateFile.content,
      metadata: templateFile.metadata
    };
  } catch (error) {
    return null;
  }
}

/**
 * Get all available templates from the templates directory
 */
export async function getAvailableTemplates(): Promise<Array<{ type: string; name: string; description: string }>> {
  try {
    const files = await fs.readdir(templateDir);
    const templates = [];

    for (const file of files) {
      if (path.extname(file) === '.yaml') {
        const templateName = path.basename(file, '.yaml');
        try {
          const template = await loadTemplate(templateName);
          if (template) {
            templates.push({
              type: templateName,
              name: template.name,
              description: template.description
            });
          }
        } catch (error) {
          // Skip invalid template files
          continue;
        }
      }
    }

    return templates.sort((a, b) => a.type.localeCompare(b.type));
  } catch (error) {
    return [];
  }
}

/**
 * Get a template by name (lazy loading)
 */
export async function getTemplate(type: string): Promise<Template | null> {
  return loadTemplate(type);
}

// For backward compatibility - dynamic Record that loads on demand
export const templates: Record<string, Promise<Template | null>> = new Proxy({}, {
  get: (_, prop: string) => {
    if (typeof prop === 'string') {
      return loadTemplate(prop);
    }
    return undefined;
  }
});