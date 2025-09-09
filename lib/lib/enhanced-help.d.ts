/**
 * Enhanced help system with examples, tips, and context
 */
export declare const helpExamples: {
    init: {
        title: string;
        description: string;
        examples: string[];
        tips: string[];
    };
    validate: {
        title: string;
        description: string;
        examples: string[];
        tips: string[];
    };
    gen: {
        title: string;
        description: string;
        examples: string[];
        tips: string[];
    };
    diff: {
        title: string;
        description: string;
        examples: string[];
        tips: string[];
    };
    trace: {
        title: string;
        description: string;
        examples: string[];
        tips: string[];
    };
    ai: {
        title: string;
        description: string;
        examples: string[];
        tips: string[];
    };
    plan: {
        title: string;
        description: string;
        examples: string[];
        tips: string[];
    };
    tasks: {
        title: string;
        description: string;
        examples: string[];
        tips: string[];
    };
    run: {
        title: string;
        description: string;
        examples: string[];
        tips: string[];
    };
    check: {
        title: string;
        description: string;
        examples: string[];
        tips: string[];
    };
    coverage: {
        title: string;
        description: string;
        examples: string[];
        tips: string[];
    };
    refine: {
        title: string;
        description: string;
        examples: string[];
        tips: string[];
    };
};
/**
 * Get enhanced help for a command
 */
export declare function getEnhancedHelp(commandName: string): string;
/**
 * Get quick command reference
 */
export declare function getCommandReference(): string;
/**
 * Add examples to commander command
 */
export declare function addExamplesToCommander(cmd: any, commandName: string): void;
