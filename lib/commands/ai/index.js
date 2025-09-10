"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiCommand = void 0;
const cli_1 = require("../../lib/cli");
const connect_1 = require("./connect");
const disconnect_1 = require("./disconnect");
const sync_1 = require("./sync");
const ide_context_1 = require("./ide-context");
exports.aiCommand = (0, cli_1.createCommand)('ai', 'AI assistant integration')
    .description('Connect and collaborate with AI coding assistants')
    .addCommand(connect_1.connectCommand)
    .addCommand(disconnect_1.disconnectCommand)
    .addCommand(sync_1.syncCommand)
    .addCommand(ide_context_1.ideContextCommand)
    .action(() => {
    console.log('\n🤖 VibeSpec AI Integration');
    console.log('💡 Connect and collaborate with AI coding assistants');
    console.log('\n📋 Available AI Providers:');
    console.log('  • cursor     - Real-time collaboration with Cursor AI');
    console.log('  • copilot    - Intelligent context sharing with GitHub Copilot');
    console.log('  • claude     - Direct interaction with Claude CLI');
    console.log('  • ollama     - Local AI model support');
    console.log('  • gemini     - Google AI services integration');
    console.log('  • qwen       - Alibaba Qwen CLI coding assistant');
    console.log('  • openai     - OpenAI Codex API integration');
    console.log('  • starcoder  - Local StarCoder model');
    console.log('  • codegeex   - Local CodeGeeX model');
    console.log('  • codet5     - Local CodeT5 model');
    console.log('  • polycoder  - Local PolyCoder model');
    console.log('  • mpt-code   - Local MPT-Code model');
    console.log('  • a-code     - Local A-Code model');
    console.log('\n🚀 Quick Start:');
    console.log('  vibe ai connect cursor              # Connect to Cursor');
    console.log('  vibe ai disconnect cursor           # Disconnect from Cursor');
    console.log('  vibe ai sync cursor                 # Sync spec with Cursor');
    console.log('  vibe ai ide-context cursor          # Generate IDE context for Cursor');
    console.log('  vibe ai connect claude              # Connect to Claude');
    console.log('  vibe ai connect ollama --model llama2  # Connect to local Ollama');
    console.log('  vibe ai connect qwen                # Connect to Qwen CLI');
    console.log('  vibe ai connect openai --api-key YOUR_KEY  # Connect to OpenAI');
    console.log('  vibe ai connect starcoder           # Connect to local StarCoder');
    console.log('\n💡 Use "vibe ai connect --help" for detailed options');
});
