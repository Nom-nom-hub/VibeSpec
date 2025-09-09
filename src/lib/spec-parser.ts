import * as yaml from 'js-yaml';
import * as fs from 'fs-extra';
import * as path from 'path';

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
export async function loadSpec(filePath: string): Promise<VibeSpec> {
  const ext = path.extname(filePath).toLowerCase();
  const content = await fs.readFile(filePath, 'utf-8');

  switch (ext) {
    case '.yaml':
    case '.yml':
      return yaml.load(content) as VibeSpec;
    case '.json':
      return JSON.parse(content);
    default:
      throw new Error(`Unsupported file format: ${ext}`);
  }
}

/**
 * Validate spec structure against expected format
 */
export function validateSpec(spec: VibeSpec): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!spec.project) {
    errors.push('Project name is required');
  }

  if (!spec.features || spec.features.length === 0) {
    errors.push('At least one feature is required');
  }

  // Feature validation
  if (spec.features) {
    spec.features.forEach((feature, index) => {
      if (!feature.name) {
        errors.push(`Feature ${index + 1}: name is required`);
      }

      if (!feature.requirements || feature.requirements.length === 0) {
        warnings.push(`Feature "${feature.name}": no requirements defined`);
      }

      // Flow validation
      if (feature.flows) {
        feature.flows.forEach((flow, flowIndex) => {
          if (!flow.name) {
            errors.push(`Feature "${feature.name}", flow ${flowIndex + 1}: name is required`);
          }
          if (!flow.steps || flow.steps.length === 0) {
            warnings.push(`Feature "${feature.name}", flow "${flow.name}": no steps defined`);
          }
        });
      }
    });
  }

  // Optional validations with warnings
  if (!spec.version) {
    warnings.push('Version not specified');
  }

  if (!spec.description) {
    warnings.push('Project description not specified');
  }

  if (!spec.goals || spec.goals.length === 0) {
    warnings.push('No project goals defined');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Generate spec from plain text description using AI assistance
 */
export async function generateSpecFromText(text: string, aiAdapter?: string): Promise<VibeSpec> {
  // TODO: Implement AI integration for spec generation
  // This will use the adapter system to convert plain text to structured spec
  throw new Error('generateSpecFromText not yet implemented');
}