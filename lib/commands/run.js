"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCommand = void 0;
const cli_1 = require("../lib/cli");
exports.runCommand = (0, cli_1.createCommand)('run <task>', 'Execute a spec task with AI assistance')
    .action(async (task, options) => {
    console.log('🏃 run command: Execute tasks with AI assistance');
    console.log(`🎯 Task: ${task}`);
    console.log('🚀 Uses AI to help implement the specified requirement or feature');
    console.log('💡 Provides code suggestions, reviews, and automated implementation');
});
