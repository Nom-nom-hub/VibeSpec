import { Command } from 'commander';
import { createCommand } from '../../lib/cli';
import { connectCommand } from './connect';
import { disconnectCommand } from './disconnect';
import { syncCommand } from './sync';
import { ideContextCommand } from './ide-context';

export const aiCommand = createCommand('ai', 'AI assistant integration')
  .description('Connect and collaborate with AI coding assistants')
  .addCommand(connectCommand)
  .addCommand(disconnectCommand)
  .addCommand(syncCommand)
  .addCommand(ideContextCommand)
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