import { VibeSpec, VibeFeature, VibeFlow } from './spec-parser';

export interface SpecDiff {
  added: DiffItem[];
  removed: DiffItem[];
  modified: DiffItem[];
  unchanged: DiffItem[];
}

export interface DiffItem {
  type: 'project' | 'version' | 'description' | 'goal' | 'constraint' | 'feature' | 'requirement' | 'flow';
  name: string;
  path: string;
  value?: any;
  newValue?: any;
  oldValue?: any;
}

/**
 * Compare two VibeSpec objects and return differences
 */
export function compareSpecs(spec1: VibeSpec, spec2: VibeSpec): SpecDiff {
  const diff: SpecDiff = {
    added: [],
    removed: [],
    modified: [],
    unchanged: []
  };

  // Compare basic properties
  compareBasicProperties(spec1, spec2, diff);

  // Compare goals
  if (spec1.goals && spec2.goals) {
    compareArrays(spec1.goals, spec2.goals, diff, 'goal');
  }

  // Compare constraints
  if (spec1.constraints && spec2.constraints) {
    compareArrays(spec1.constraints, spec2.constraints, diff, 'constraint');
  }

  // Compare features
  if (spec1.features && spec2.features) {
    compareFeatures(spec1.features, spec2.features, diff);
  }

  return diff;
}

/**
 * Compare basic spec properties
 */
function compareBasicProperties(spec1: VibeSpec, spec2: VibeSpec, diff: SpecDiff): void {
  // Compare project name
  if (spec1.project !== spec2.project) {
    if (spec1.project && !spec2.project) {
      diff.removed.push({ type: 'project', name: 'project', path: 'project', oldValue: spec1.project });
    } else if (!spec1.project && spec2.project) {
      diff.added.push({ type: 'project', name: 'project', path: 'project', newValue: spec2.project });
    } else {
      diff.modified.push({ type: 'project', name: 'project', path: 'project', oldValue: spec1.project, newValue: spec2.project });
    }
  }

  // Compare version
  if (spec1.version !== spec2.version) {
    if (spec1.version && !spec2.version) {
      diff.removed.push({ type: 'version', name: 'version', path: 'version', oldValue: spec1.version });
    } else if (!spec1.version && spec2.version) {
      diff.added.push({ type: 'version', name: 'version', path: 'version', newValue: spec2.version });
    } else {
      diff.modified.push({ type: 'version', name: 'version', path: 'version', oldValue: spec1.version, newValue: spec2.version });
    }
  }

  // Compare description
  if (spec1.description !== spec2.description) {
    if (spec1.description && !spec2.description) {
      diff.removed.push({ type: 'description', name: 'description', path: 'description', oldValue: spec1.description });
    } else if (!spec1.description && spec2.description) {
      diff.added.push({ type: 'description', name: 'description', path: 'description', newValue: spec2.description });
    } else {
      diff.modified.push({ type: 'description', name: 'description', path: 'description', oldValue: spec1.description, newValue: spec2.description });
    }
  }
}

/**
 * Compare arrays of simple strings
 */
function compareArrays(array1: string[], array2: string[], diff: SpecDiff, type: 'goal' | 'constraint' | 'requirement' | 'flow'): void {
  const set1 = new Set(array1);
  const set2 = new Set(array2);

  // Added items
  for (const item of array2) {
    if (!set1.has(item)) {
      diff.added.push({ type, name: item, path: `${type}s`, newValue: item });
    }
  }

  // Removed items
  for (const item of array1) {
    if (!set2.has(item)) {
      diff.removed.push({ type, name: item, path: `${type}s`, oldValue: item });
    }
  }
}

/**
 * Compare features arrays
 */
function compareFeatures(features1: VibeFeature[], features2: VibeFeature[], diff: SpecDiff): void {
  const map1 = new Map<string, VibeFeature>();
  const map2 = new Map<string, VibeFeature>();

  // Create maps by feature name
  features1.forEach(feature => map1.set(feature.name, feature));
  features2.forEach(feature => map2.set(feature.name, feature));

  // Compare features
  for (const [name, feature1] of map1) {
    const feature2 = map2.get(name);
    if (!feature2) {
      // Feature removed
      diff.removed.push({ type: 'feature', name, path: `features.${name}`, oldValue: feature1 });
    } else {
      // Feature exists in both, compare details
      compareFeatureDetails(feature1, feature2, name, diff);
    }
  }

  // Added features
  for (const [name, feature] of map2) {
    if (!map1.has(name)) {
      diff.added.push({ type: 'feature', name, path: `features.${name}`, newValue: feature });
    }
  }
}

/**
 * Compare feature details (requirements, flows, etc.)
 */
function compareFeatureDetails(feature1: VibeFeature, feature2: VibeFeature, featureName: string, diff: SpecDiff): void {
  // Compare descriptions
  if (feature1.description !== feature2.description) {
    if (feature1.description && !feature2.description) {
      diff.removed.push({
        type: 'description',
        name: `${featureName} description`,
        path: `features.${featureName}.description`,
        oldValue: feature1.description
      });
    } else if (!feature1.description && feature2.description) {
      diff.added.push({
        type: 'description',
        name: `${featureName} description`,
        path: `features.${featureName}.description`,
        newValue: feature2.description
      });
    } else {
      diff.modified.push({
        type: 'description',
        name: `${featureName} description`,
        path: `features.${featureName}.description`,
        oldValue: feature1.description,
        newValue: feature2.description
      });
    }
  }

  // Compare requirements
  if (feature1.requirements && feature2.requirements) {
    compareArrays(feature1.requirements, feature2.requirements, diff, 'requirement');
  }

  // Compare flows
  if (feature1.flows && feature2.flows) {
    const flows1 = feature1.flows.map(flow => flow.name);
    const flows2 = feature2.flows.map(flow => flow.name);
    compareArrays(flows1, flows2, diff, 'flow');
  }
}

/**
 * Format diff for display
 */
export function formatDiff(diff: SpecDiff): string {
  let output = '';

  if (diff.added.length > 0) {
    output += '🟢 ADDED:\n';
    diff.added.forEach(item => {
      output += `  + ${item.type}: ${item.name}\n`;
    });
    output += '\n';
  }

  if (diff.removed.length > 0) {
    output += '🔴 REMOVED:\n';
    diff.removed.forEach(item => {
      output += `  - ${item.type}: ${item.name}\n`;
    });
    output += '\n';
  }

  if (diff.modified.length > 0) {
    output += '🟡 MODIFIED:\n';
    diff.modified.forEach(item => {
      if (item.oldValue && item.newValue) {
        output += `  ~ ${item.type}: ${item.name}\n`;
        output += `    Old: ${item.oldValue}\n`;
        output += `    New: ${item.newValue}\n`;
      }
    });
    output += '\n';
  }

  if (diff.added.length === 0 && diff.removed.length === 0 && diff.modified.length === 0) {
    output = '✨ No differences found - specs are identical\n';
  }

  return output.trim();
}

/**
 * Create summary statistics for diff
 */
export function getDiffSummary(diff: SpecDiff): { additions: number; removals: number; modifications: number; unchanged: number } {
  return {
    additions: diff.added.length,
    removals: diff.removed.length,
    modifications: diff.modified.length,
    unchanged: diff.unchanged.length
  };
}