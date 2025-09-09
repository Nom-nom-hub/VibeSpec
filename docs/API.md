# 📚 VibeSpec API Documentation

Technical documentation for VibeSpec's internal APIs, modules, and extension points.

## Table of Contents

- [Overview](#overview)
- [Core Modules](#core-modules)
- [Template System](#template-system)
- [Command Architecture](#command-architecture)
- [Extension Points](#extension-points)
- [Data Structures](#data-structures)

## Overview

VibeSpec is built as a modular Node.js/TypeScript CLI application with clean separation of concerns. The architecture supports extensibility through well-defined interfaces and plugin points.

## Core Modules

### 🙋 Spec Parser (`spec-parser.ts`)

Handles YAML/JSON parsing and specification validation.

#### Functions

##### `loadSpec(filePath: string): Promise<VibeSpec>`

Loads and parses a specification file.

**Parameters:**
- `filePath`: Path to the YAML/JSON specification file

**Returns:** Promise resolving to validated VibeSpec object

**Usage:**
```typescript
const spec = await loadSpec('./spec.yaml');
console.log(spec.project, spec.version);
```

##### `validateSpec(spec: VibeSpec): ValidationResult`

Validates a specification object against the schema.

**Parameters:**
- `spec`: VibeSpec object to validate

**Returns:** Validation result with errors, warnings, and validity status

**Usage:**
```typescript
const validation = validateSpec(spec);
if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
}
```

##### `generateSpecFromText(description: string): VibeSpec`

Generates a basic specification from plain text description.

**Parameters:**
- `description`: Plain text description of the project

**Returns:** Generated VibeSpec object

### 🎨 Template System (`templates.ts`)

Manages specification templates (file-based since v2.0.0).

#### Functions

##### `loadTemplate(templateType: string): Promise<Template | null>`

Loads a template from the templates directory.

**Parameters:**
- `templateType`: Template name (e.g., 'web-app', 'ai-agent')

**Returns:** Promise resolving to Template object or null

##### `getAvailableTemplates(): Promise<Array<{type: string, name: string, description: string}>>`

Retrieves list of all available templates.

**Returns:** Array of template information objects

##### `setTemplateDirectory(dirPath: string): void`

Overrides the default template directory.

**Parameters:**
- `dirPath`: Path to custom template directory

### 📋 CLI System (`cli.ts`)

Provides utilities and helpers for command-line interface operations.

#### Functions

##### `createCommand(name: string, desc: string): commander.Command`

Creates a new CLI command with consistent configuration.

**Parameters:**
- `name`: Command name
- `desc`: Command description

**Returns:** Configured Commander.js command instance

##### CLI Helper Functions

- `success(message: string)`: Print success message
- `error(message: string)`: Print error message
- `warning(message: string)`: Print warning message
- `info(message: string)`: Print info message

### 🔄 Snapshot Manager (`snapshot-manager.ts`)

Handles specification versioning and snapshots.

#### Functions

##### `createSnapshot(projectRoot: string, version: string, description?: string): Promise<void>`

Creates a new specification snapshot.

**Parameters:**
- `projectRoot`: Project directory path
- `version`: Semantic version for the snapshot
- `description`: Optional description of changes

##### `listSnapshots(projectRoot: string): Promise<SnapshotInfo[]>`

Lists all available snapshots.

**Parameters:**
- `projectRoot`: Project directory path

**Returns:** Array of snapshot information

## Command Architecture

### Command Structure

Each command follows a consistent pattern:

```typescript
import { createCommand, success, error, info } from '../lib/cli';

export const commandNameCommand = createCommand('command-name', 'Command description')
  .option('-v, --verbose', 'Enable verbose output')
  .action(async (options) => {
    try {
      // Command implementation
      success('Operation completed successfully');
    } catch (err) {
      error(`Operation failed: ${err.message}`);
      process.exit(1);
    }
  });
```

### Command Registration

Commands are registered in `bin/vibe.js`:

```javascript
// Import commands
const { initCommand } = require('../lib/commands/init');
const { validateCommand } = require('../lib/commands/validate');
const { exportCommand } = require('../lib/commands/export');

// Register with CLI
program.addCommand(initCommand);
program.addCommand(validateCommand);
program.addCommand(exportCommand);
```

## Extension Points

### Custom Templates

Users can extend VibeSpec by creating custom templates:

```bash
# Create custom template
vibe template create my-template

# Template stored at ~/.vibespec/templates/my-template.yaml
# Use with: vibe init --template custom:my-template
```

### Custom Commands

Advanced users can extend the CLI by:

1. Creating new command files in `src/commands/`
2. Adding exports to `src/index.ts`
3. Registering in `bin/vibe.js`
4. Testing the integration

### Template Variables (Future Enhancement)

The template system includes placeholder for dynamic variables:

```yaml
templateConfig:
  variables:
    - name: "database_type"
      default: "postgresql"
      options: ["postgresql", "mongodb", "sqlite"]
```

## Data Structures

### VibeSpec Interface

```typescript
interface VibeSpec {
  project: string;
  version: string;
  description?: string;
  goals?: string[];
  constraints?: string[];
  features?: Feature[];
}

interface Feature {
  name: string;
  description?: string;
  requirements: string[];
}
```

### Template Interface

```typescript
interface Template {
  name: string;
  description: string;
  content: string;
  metadata?: {
    name: string;
    description: string;
    category: string;
    type: string;
    version: string;
    author: string;
    tags: string[];
    dependencies: string[];
    lastUpdated: string;
    compatibleWith: string[];
  };
}
```

### Validation Result

```typescript
interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
```

### Snapshot Info

```typescript
interface SnapshotInfo {
  version: string;
  created: Date;
  description?: string;
  filePath: string;
}
```

## Module Dependencies

### Runtime Dependencies

```json
{
  "commander": "^11.0.0",     // CLI framework
  "js-yaml": "^4.1.0",        // YAML parsing
  "chalk": "^5.3.0",          // Terminal colors
  "fs-extra": "^11.1.1",      // Enhanced file operations
  "inquirer": "^9.2.0",       // Interactive CLI prompts
  "ora": "^7.0.1"             // CLI spinners
}
```

### Development Dependencies

```json
{
  "@types/node": "^20.8.0",           // Node.js types
  "@types/js-yaml": "^4.0.5",         // YAML types
  "@types/fs-extra": "^11.0.1",       // File operation types
  "@types/inquirer": "^9.0.3",        // Inquirer types
  "typescript": "^5.2.0",             // TypeScript compiler
  "ts-node": "^10.9.0",               // TypeScript runtime
  "eslint": "^8.50.0",                // Linting
  "prettier": "^3.0.0"               // Code formatting
}
```

## Error Handling

VibeSpec uses consistent error handling patterns:

### Synchronous Errors

```typescript
try {
  const result = performOperation();
  success(`Operation completed: ${result}`);
} catch (err) {
  error(`Operation failed: ${err.message}`);
  info('Suggestion: Check file permissions and paths');
  process.exit(1);
}
```

### Asynchronous Errors

```typescript
try {
  const result = await performAsyncOperation();
  success(`Operation completed: ${result}`);
} catch (err) {
  error(`Operation failed: ${err.message}`);
  info('💡 Troubleshooting:');
  info('   • Check if file exists');
  info('   • Verify write permissions');
  process.exit(1);
}
```

## Performance Considerations

### Template Loading

- Templates are cached in memory with 30-second TTL
- File system reads are minimized through caching
- Template validation occurs during loading

### Memory Management

- Large specifications are processed with streaming
- Cache sizes are limited to prevent memory leaks
- Temporary files are cleaned up automatically

### File I/O Optimization

- Concurrent file operations are avoided where possible
- File watching is not implemented (trade-off for simplicity)
- Atomic writes are used for critical operations

## Testing Patterns

### Unit Tests

```typescript
describe('Template System', () => {
  test('loads valid template', async () => {
    const template = await loadTemplate('web-app');
    expect(template).toBeDefined();
    expect(template?.name).toBe('Web Application');
  });

  test('returns null for invalid template', async () => {
    const template = await loadTemplate('nonexistent');
    expect(template).toBeNull();
  });
});
```

### Integration Tests

```typescript
describe('Full Workflow', () => {
  test('end-to-end spec creation', async () => {
    // Create temp directory
    const tempDir = createTempDir();

    // Initialize project
    await initProject(tempDir, 'web-app');

    // Validate spec
    const validation = await validateSpecAt(tempDir);
    expect(validation.valid).toBe(true);

    // Clean up
    removeTempDir(tempDir);
  });
});
```

---

## 📧 Getting Help

### Documentation
- [README.md](../README.md) - Main user documentation
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contributor guidelines
- [Template Development Guide](../docs/TEMPLATES.md) - Custom templates

### Support Channels
- GitHub Issues: Bug reports and feature requests
- GitHub Discussions: Technical questions and ideas
- Documentation Issues: Typos and clarifications

### Code Quality
- ESLint configuration ensures consistent code style
- Prettier handles automatic code formatting
- TypeScript provides type safety and IntelliSense

---

*This documentation is automatically updated when the codebase changes. Last updated: 2025-01-01*