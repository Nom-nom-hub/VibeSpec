"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refineCommand = exports.coverageCommand = exports.checkCommand = exports.runCommand = exports.tasksCommand = exports.planCommand = exports.specifyCommand = exports.exportCommand = exports.initCommand = exports.createCommand = exports.generateSpecFromText = exports.validateSpec = exports.loadSpec = exports.DESCRIPTION = exports.VERSION = void 0;
// Main entry point for VibeSpec CLI
__exportStar(require("./lib/spec-parser"), exports);
__exportStar(require("./lib/cli"), exports);
__exportStar(require("./commands"), exports);
// Version and metadata
exports.VERSION = '0.1.0';
exports.DESCRIPTION = 'A spec-driven development tool that integrates with AI coders to enforce structured development';
// Core functionality exports
var spec_parser_1 = require("./lib/spec-parser");
Object.defineProperty(exports, "loadSpec", { enumerable: true, get: function () { return spec_parser_1.loadSpec; } });
Object.defineProperty(exports, "validateSpec", { enumerable: true, get: function () { return spec_parser_1.validateSpec; } });
Object.defineProperty(exports, "generateSpecFromText", { enumerable: true, get: function () { return spec_parser_1.generateSpecFromText; } });
var cli_1 = require("./lib/cli");
Object.defineProperty(exports, "createCommand", { enumerable: true, get: function () { return cli_1.createCommand; } });
// Command exports
var init_1 = require("./commands/init");
Object.defineProperty(exports, "initCommand", { enumerable: true, get: function () { return init_1.initCommand; } });
var export_1 = require("./commands/export");
Object.defineProperty(exports, "exportCommand", { enumerable: true, get: function () { return export_1.exportCommand; } });
var specify_1 = require("./commands/specify");
Object.defineProperty(exports, "specifyCommand", { enumerable: true, get: function () { return specify_1.specifyCommand; } });
var plan_1 = require("./commands/plan");
Object.defineProperty(exports, "planCommand", { enumerable: true, get: function () { return plan_1.planCommand; } });
var tasks_1 = require("./commands/tasks");
Object.defineProperty(exports, "tasksCommand", { enumerable: true, get: function () { return tasks_1.tasksCommand; } });
var run_1 = require("./commands/run");
Object.defineProperty(exports, "runCommand", { enumerable: true, get: function () { return run_1.runCommand; } });
var check_1 = require("./commands/check");
Object.defineProperty(exports, "checkCommand", { enumerable: true, get: function () { return check_1.checkCommand; } });
var coverage_1 = require("./commands/coverage");
Object.defineProperty(exports, "coverageCommand", { enumerable: true, get: function () { return coverage_1.coverageCommand; } });
var refine_1 = require("./commands/refine");
Object.defineProperty(exports, "refineCommand", { enumerable: true, get: function () { return refine_1.refineCommand; } });
