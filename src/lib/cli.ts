import { Command } from 'commander';
import chalk from 'chalk';
import ora, { Ora } from 'ora';

/**
 * Create a standardized command with common options
 */
export function createCommand(name: string, description: string): Command {
  const cmd = new Command(name).description(description);

  // Add common options
  cmd.option('-v, --verbose', 'enable verbose output');
  cmd.option('-q, --quiet', 'suppress output');
  cmd.option('--config <path>', 'path to spec file', 'spec.yaml');

  return cmd;
}

/**
 * Display a success message
 */
export function success(message: string): void {
  console.log(chalk.green('✅'), message);
}

/**
 * Display an error message
 */
export function cliError(message: string): void {
  console.error(chalk.red('❌'), message);
}

/**
 * Display a critical error message
 */
export function critical(message: string): void {
  console.error(chalk.bgRed.black(' CRITICAL '), chalk.red(message));
}

/**
 * Display a warning message
 */
export function warning(message: string): void {
  console.warn(chalk.yellow('⚠️'), message);
}

/**
 * Display an info message
 */
export function info(message: string): void {
  console.log(chalk.blue('ℹ️'), message);
}

/**
 * Display a debug message
 */
export function debug(message: string): void {
  console.log(chalk.gray('🔸'), message);
}

/**
 * Display a header/title
 */
export function header(message: string): void {
  const divider = '═'.repeat(message.length + 4);
  console.log(chalk.cyan(`╔${divider}╗`));
  console.log(chalk.cyan(`║  ${message}  ║`));
  console.log(chalk.cyan(`╚${divider}╝`));
  console.log();
}

/**
 * Display a section title
 */
export function section(title: string): void {
  console.log(chalk.yellow.bold(`▼ ${title}`));
  console.log(chalk.gray('─'.repeat(40)));
}

/**
 * Display colored output based on status
 */
export function status(message: string, status: 'success' | 'error' | 'warning' | 'info' | 'debug'): void {
  switch (status) {
    case 'success':
      success(message);
      break;
    case 'error':
      cliError(message);
      break;
    case 'warning':
      warning(message);
      break;
    case 'info':
      info(message);
      break;
    case 'debug':
      debug(message);
      break;
  }
}

/**
 * Display a progress indicator
 */
export function progress(current: number, total: number, label: string = ''): void {
  const percentage = Math.round((current / total) * 100);
  const progressBar = '='.repeat(Math.floor(percentage / 5)) + ' '.repeat(20 - Math.floor(percentage / 5));
  const labelText = label ? `${label}: ` : '';
  process.stdout.write(`\r${labelText}[${chalk.cyan(progressBar)}] ${percentage}% (${current}/${total})`);
  if (current === total) {
    console.log(chalk.green(' ✓ Complete!'));
  }
}

/**
 * Clear terminal screen
 */
export function clear(): void {
  console.clear();
}

/**
 * Create a spinner for long-running operations
 */
export function createSpinner(text: string): Ora {
  return ora(text);
}

/**
 * Handle CLI errors consistently
 */
export function handleError(cliError: Error, verbose: boolean = false): void {
  const err = new Error(cliError.message || 'Unknown error occurred');
  console.error(chalk.red('✗'), err.message);
  if (verbose) {
    console.error(cliError.stack || err.stack);
  }
  process.exit(1);
}