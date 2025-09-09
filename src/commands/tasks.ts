import { createCommand } from '../lib/cli';

export const tasksCommand = createCommand('tasks', 'Show and manage tasks from spec')
  .action(async (options) => {
    console.log('📝 tasks command: Manage development tasks from spec');
    console.log('🎯 Track progress on requirements implementation');
    console.log('🚀 Create, prioritize, and organize specification-derived tasks');
  });