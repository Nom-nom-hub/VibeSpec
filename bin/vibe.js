#!/usr/bin/env node

const { Command } = require('commander');
const { initCommand } = require('../lib/commands/init');
const { specifyCommand } = require('../lib/commands/specify');
const { planCommand } = require('../lib/commands/plan');
const { tasksCommand } = require('../lib/commands/tasks');
const { runCommand } = require('../lib/commands/run');
const { checkCommand } = require('../lib/commands/check');
const { coverageCommand } = require('../lib/commands/coverage');
const { refineCommand } = require('../lib/commands/refine');
const { validateCommand } = require('../lib/commands/validate');
const { genCommand } = require('../lib/commands/gen');
const { diffCommand } = require('../lib/commands/diff');
const { traceCommand } = require('../lib/commands/trace');
const { snapshotCommand } = require('../lib/commands/snapshot');
const { templateCommand } = require('../lib/commands/template');
const { aiCommand } = require('../lib/commands/ai');
const { exportCommand } = require('../lib/commands/export');

const program = new Command();

// Enhanced welcome messages when no arguments provided
if (process.argv.length === 2) {
  console.log('\n🎵  VibeSpec - Spec-Driven Development Tool');
  console.log('💡 Define specs, Generate AI context, Prevent drift');
  console.log('\n📝 Commands: init, validate, gen, export, diff, trace, snapshot, template');
  console.log('🚀 Quick start: "vibe init" to create your first spec\n');
}

program
  .name('vibe')
  .description('A spec-driven development tool for AI-assisted coding')
  .version('0.1.0');

// Register commands
program.addCommand(initCommand);
program.addCommand(validateCommand);
program.addCommand(genCommand);
program.addCommand(diffCommand);
program.addCommand(traceCommand);
program.addCommand(snapshotCommand);
program.addCommand(templateCommand);
program.addCommand(exportCommand);
program.addCommand(aiCommand);
program.addCommand(specifyCommand);
program.addCommand(planCommand);
program.addCommand(tasksCommand);
program.addCommand(runCommand);
program.addCommand(checkCommand);
program.addCommand(coverageCommand);
program.addCommand(refineCommand);

program.parse();