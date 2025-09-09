"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCommand = void 0;
const cli_1 = require("../lib/cli");
exports.checkCommand = (0, cli_1.createCommand)('check', 'Validate implementation against spec')
    .action(async (options) => {
    console.log('🔍 check command: Validate implementation against specification');
    console.log('🎯 Compare actual code against spec requirements');
    console.log('🚨 Detect drift, missing implementations, and specification violations');
    console.log('📊 Generate coverage reports and implementation gaps');
});
