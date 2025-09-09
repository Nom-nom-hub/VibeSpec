"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommand = createCommand;
exports.success = success;
exports.cliError = cliError;
exports.critical = critical;
exports.warning = warning;
exports.info = info;
exports.debug = debug;
exports.header = header;
exports.section = section;
exports.status = status;
exports.progress = progress;
exports.clear = clear;
exports.createSpinner = createSpinner;
exports.handleError = handleError;
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
/**
 * Create a standardized command with common options
 */
function createCommand(name, description) {
    const cmd = new commander_1.Command(name).description(description);
    // Add common options
    cmd.option('-v, --verbose', 'enable verbose output');
    cmd.option('-q, --quiet', 'suppress output');
    cmd.option('--config <path>', 'path to spec file', 'spec.yaml');
    return cmd;
}
/**
 * Display a success message
 */
function success(message) {
    console.log(chalk_1.default.green('✅'), message);
}
/**
 * Display an error message
 */
function cliError(message) {
    console.error(chalk_1.default.red('❌'), message);
}
/**
 * Display a critical error message
 */
function critical(message) {
    console.error(chalk_1.default.bgRed.black(' CRITICAL '), chalk_1.default.red(message));
}
/**
 * Display a warning message
 */
function warning(message) {
    console.warn(chalk_1.default.yellow('⚠️'), message);
}
/**
 * Display an info message
 */
function info(message) {
    console.log(chalk_1.default.blue('ℹ️'), message);
}
/**
 * Display a debug message
 */
function debug(message) {
    console.log(chalk_1.default.gray('🔸'), message);
}
/**
 * Display a header/title
 */
function header(message) {
    const divider = '═'.repeat(message.length + 4);
    console.log(chalk_1.default.cyan(`╔${divider}╗`));
    console.log(chalk_1.default.cyan(`║  ${message}  ║`));
    console.log(chalk_1.default.cyan(`╚${divider}╝`));
    console.log();
}
/**
 * Display a section title
 */
function section(title) {
    console.log(chalk_1.default.yellow.bold(`▼ ${title}`));
    console.log(chalk_1.default.gray('─'.repeat(40)));
}
/**
 * Display colored output based on status
 */
function status(message, status) {
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
function progress(current, total, label = '') {
    const percentage = Math.round((current / total) * 100);
    const progressBar = '='.repeat(Math.floor(percentage / 5)) + ' '.repeat(20 - Math.floor(percentage / 5));
    const labelText = label ? `${label}: ` : '';
    process.stdout.write(`\r${labelText}[${chalk_1.default.cyan(progressBar)}] ${percentage}% (${current}/${total})`);
    if (current === total) {
        console.log(chalk_1.default.green(' ✓ Complete!'));
    }
}
/**
 * Clear terminal screen
 */
function clear() {
    console.clear();
}
/**
 * Create a spinner for long-running operations
 */
function createSpinner(text) {
    return (0, ora_1.default)(text);
}
/**
 * Handle CLI errors consistently
 */
function handleError(cliError, verbose = false) {
    const err = new Error(cliError.message || 'Unknown error occurred');
    console.error(chalk_1.default.red('✗'), err.message);
    if (verbose) {
        console.error(cliError.stack || err.stack);
    }
    process.exit(1);
}
