"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.specifyCommand = void 0;
const cli_1 = require("../lib/cli");
exports.specifyCommand = (0, cli_1.createCommand)('specify <description>', 'Convert plain text description into structured spec')
    .action(async (description, options) => {
    console.log('🛠️ specify command: Convert plain text into structured spec');
    console.log(`Description: ${description}`);
    console.log('🎯 This command will analyze your description and generate a complete spec.yaml structure');
    console.log('📋 Use AI to parse natural language requirements into structured specifications');
});
