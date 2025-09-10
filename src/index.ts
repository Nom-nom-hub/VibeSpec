// Main entry point for VibeSpec CLI
export * from './lib/spec-parser';
export * from './lib/cli';
export * from './commands';

// Version and metadata
export const VERSION = '0.1.0';
export const DESCRIPTION = 'A spec-driven development tool that integrates with AI coders to enforce structured development';

// Core functionality exports
export { loadSpec, validateSpec, generateSpecFromText } from './lib/spec-parser';
export { createCommand } from './lib/cli';

// Command exports
export { initCommand } from './commands/init';
export { exportCommand } from './commands/export';
export { aiCommand } from './commands/ai';
export { specifyCommand } from './commands/specify';
export { planCommand } from './commands/plan';
export { tasksCommand } from './commands/tasks';
export { runCommand } from './commands/run';
export { checkCommand } from './commands/check';
export { coverageCommand } from './commands/coverage';
export { refineCommand } from './commands/refine';