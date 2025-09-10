# AI Adapter Connection Behavior

## Connection State Management

The VibeSpec CLI tool manages AI adapter connections in a stateless manner, which is typical for CLI applications. Each command runs in its own process, so connection state is not persisted between commands.

### How It Works

1. **Per-Command Connections**: When you run `vibe ai connect <provider>`, the tool establishes a connection and immediately exits. The connection state is not saved to disk.

2. **Credential Persistence**: Authentication credentials (API keys) are securely stored using the TokenManager and can be reused across sessions.

3. **On-Demand Connections**: When you run commands like `vibe ai sync <provider>`, the tool will:
   - Check for stored credentials for the provider
   - Establish a new connection using those credentials
   - Perform the requested operation
   - Close the connection

### Why This Design?

1. **Security**: Connections often contain sensitive session information that should not be persisted.

2. **Reliability**: Network connections can become stale or invalid. Establishing fresh connections ensures reliability.

3. **Resource Management**: Long-lived connections consume resources. Short-lived connections are more efficient.

4. **CLI Best Practices**: Statelessness is a fundamental principle of well-designed CLI tools.

### Working With Connections

To work effectively with AI adapters:

1. **Provide Credentials**: Use the `--api-key` option when connecting:
   ```
   vibe ai connect copilot --api-key YOUR_API_KEY
   ```

2. **Use Environment Variables**: For convenience, you can set environment variables:
   ```
   export VIBESPEC_COPILOT_API_KEY=your_api_key
   vibe ai connect copilot
   ```

3. **Automated Connection**: Future versions may automatically establish connections when needed, using stored credentials.

## Supported AI Providers

- **Cursor AI**: Real-time collaboration with Cursor AI
- **GitHub Copilot**: Intelligent code completion with GitHub Copilot
- **Claude**: Conversational AI with Anthropic's Claude
- **Ollama**: Local AI models with Ollama
- **Gemini**: Google's Gemini AI models

Each provider has its own authentication requirements and capabilities.