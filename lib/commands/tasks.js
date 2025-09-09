"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tasksCommand = void 0;
const cli_1 = require("../lib/cli");
exports.tasksCommand = (0, cli_1.createCommand)('tasks', 'Show and manage tasks from spec')
    .action(async (options) => {
    console.log('📝 tasks command: Manage development tasks from spec');
    console.log('🎯 Track progress on requirements implementation');
    console.log('🚀 Create, prioritize, and organize specification-derived tasks');
});
