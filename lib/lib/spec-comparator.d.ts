import { VibeSpec } from './spec-parser';
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
export declare function compareSpecs(spec1: VibeSpec, spec2: VibeSpec): SpecDiff;
/**
 * Format diff for display
 */
export declare function formatDiff(diff: SpecDiff): string;
/**
 * Create summary statistics for diff
 */
export declare function getDiffSummary(diff: SpecDiff): {
    additions: number;
    removals: number;
    modifications: number;
    unchanged: number;
};
