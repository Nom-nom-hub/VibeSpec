"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.planCommand = void 0;
const cli_1 = require("../lib/cli");
exports.planCommand = (0, cli_1.createCommand)('plan', 'Generate implementation plan from spec')
    .action(async (options) => {
    console.log('📋 plan command: Generate structured implementation plan');
    console.log('🎯 This will convert your spec into a step-by-step development roadmap');
    console.log('🚀 Create milestones, tasks, and dependencies from requirements');
});
