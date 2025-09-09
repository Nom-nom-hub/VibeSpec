import { Command } from 'commander';
import { Ora } from 'ora';
/**
 * Create a standardized command with common options
 */
export declare function createCommand(name: string, description: string): Command;
/**
 * Display a success message
 */
export declare function success(message: string): void;
/**
 * Display an error message
 */
export declare function cliError(message: string): void;
/**
 * Display a critical error message
 */
export declare function critical(message: string): void;
/**
 * Display a warning message
 */
export declare function warning(message: string): void;
/**
 * Display an info message
 */
export declare function info(message: string): void;
/**
 * Display a debug message
 */
export declare function debug(message: string): void;
/**
 * Display a header/title
 */
export declare function header(message: string): void;
/**
 * Display a section title
 */
export declare function section(title: string): void;
/**
 * Display colored output based on status
 */
export declare function status(message: string, status: 'success' | 'error' | 'warning' | 'info' | 'debug'): void;
/**
 * Display a progress indicator
 */
export declare function progress(current: number, total: number, label?: string): void;
/**
 * Clear terminal screen
 */
export declare function clear(): void;
/**
 * Create a spinner for long-running operations
 */
export declare function createSpinner(text: string): Ora;
/**
 * Handle CLI errors consistently
 */
export declare function handleError(cliError: Error, verbose?: boolean): void;
