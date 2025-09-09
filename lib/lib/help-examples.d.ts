/**
 * Help examples and onboarding content for VibeSpec
 */
export declare const helpExamples: {
    init: string[];
    validate: string[];
    gen: string[];
    diff: string[];
    trace: string[];
    ai: string[];
};
export declare function getExampleHelp(commandName: string): string;
export declare function getOnboardingSteps(): string;
export declare function getCommandQuickTip(commandName: string): string;
