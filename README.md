# 🎵 VibeSpec - Spec-Driven Development Tool

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

> **Define specs, Generate AI context, Prevent drift**

A powerful command-line tool for specification-driven development that integrates seamlessly with AI coding assistants like Cursor, GitHub Copilot, and Claude to ensure structured development and maintain traceability between requirements and generated code.

## ✨ Features

- 📝 **12 Professional Templates**: From web apps to AI agents, games, and data pipelines
- 📋 **Structured Specifications**: YAML-based specs with goals, features, and requirements
- 🎯 **AI Context Generation**: Export specs to JSON, CSV, YAML for AI assistants
- 📖 **Version Control**: Snapshot system for specification versioning
- 🔧 **Custom Templates**: Create and manage your own specification templates
- ✅ **Validation System**: Comprehensive spec validation with helpful error messages
- 📚 **Documentation Generation**: Auto-generate markdown docs from specs
- ⚡ **CLI Excellence**: Fast, intuitive command-line interface

## 🚀 Quick Start

### Installation

```bash
npm install -g vibespec
# or
npx vibespec
```

### Create Your First Spec

```bash
# Initialize with your preferred template
vibe init --template web-app

# Validate your specification
vibe validate

# Generate documentation
vibe gen

# Export for AI context
vibe export --format json --output ai-context.json
```

### Example Workflow

```bash
# 1. Create a new project specification
vibe init --template api

# 2. Customize the spec.yaml file in your editor
# The template provides a comprehensive starting point

# 3. Validate your changes
vibe validate

# 4. Generate implementation documentation
vibe gen

# 5. Export to share with your AI assistant
vibe export --format json --output project-spec.json
```

## 📚 Available Templates

### 🎨 General Purpose
- **`default`** - Basic project structure with common features
- **`empty`** - Minimal template for complete customization
- **`prd`** - Product requirements document template

### 🖥️ Development & Infrastructure
- **`web-app`** - Modern web application with UI, routing, and state management
- **`mobile-app`** - Native mobile app for iOS and Android platforms
- **`library`** - Reusable code library or SDK
- **`cli-tool`** - Command-line interface tool with commands and options
- **`api`** - REST API specification template
- **`microservice`** - Individual microservice with APIs and deployment

### 🤖 Specialized Domains
- **`ai-agent`** - Intelligent agent with learning capabilities and API integration
- **`game`** - Interactive game with mechanics, levels, and engaging gameplay
- **`data-pipeline`** - ETL pipeline for data processing, validation, and analytics

### 📋 Template Structure

Each template provides a structured YAML specification:

```yaml
project: "My Project"
version: "1.0.0"
description: >
  Project description

goals:
  - Deliver a high-quality product
  - Maintain code quality and standards

features:
  - name: "Core Feature"
    description: "Feature description"
    requirements:
      - Requirement 1
      - Requirement 2
      - Requirement 3
```

## 📖 Commands

### Project Management

```bash
vibe init                    # Initialize new project with template
vibe validate               # Validate spec.yaml file
vibe gen                    # Generate documentation from spec
```

### Version Control

```bash
vibe snapshot create <version>  # Create spec snapshot
vibe snapshot list               # List all snapshots
vibe snapshot show <version>     # Show snapshot details
vibe snapshot restore <version> # Restore from snapshot
```

### Template Management

```bash
vibe template list              # List all templates
vibe template show <name>       # Show template details
vibe template create <name>     # Create custom template
vibe template delete <name>     # Delete custom template
```

### Export & Integration

```bash
vibe export --format json              # Export to JSON
vibe export --format csv               # Export to CSV
vibe export --format yaml              # Export to YAML
vibe export --output custom.json       # Custom output filename
```

### Advanced Features

```bash
vibe diff <file1> <file2>      # Compare two specifications
vibe specify <description>    # Generate spec from description
vibe plan                     # Generate implementation plan
vibe tasks                    # Show and manage tasks
vibe run <task>              # Execute task with AI assistance
vibe check                    # Validate implementation
vibe coverage                 # Show implementation coverage
```

## 🔧 Creating Custom Templates

### Basic Custom Template

```bash
# Create a basic custom template
vibe template create my-api

# This creates ~/.vibespec/templates/my-api.yaml
# Customize the spec as needed

# Use your custom template
vibe init --template custom:my-api
```

### Template Structure

Custom templates follow this metadata-enhanced structure:

```yaml
# Template metadata
metadata:
  name: "My Custom API"
  description: "Custom API specification template"
  category: "API"
  type: "service"
  version: "1.0.0"
  author: "Your Name"
  tags: ["api", "custom", "service"]
  dependencies: ["express", "database"]
  lastUpdated: "2025-01-01"

# Template configuration
templateConfig:
  generateFrom: "content"
  variables: []  # Future: dynamic variable substitution

# The actual spec template content
content: |
  project: "Custom API"
  version: "1.0.0"
  description: >
    Custom API specification

  goals:
    - Provide flexible API endpoints
    - Ensure scalability

  features:
    - name: "API Endpoints"
      description: "RESTful API endpoints"
      requirements:
        - Support CRUD operations
        - Include proper error handling
```

## 🎯 AI Integration Examples

### Export for Cursor/Claude

```bash
# Export spec in JSON format for AI context
vibe export --format json --output project-spec.json

# The exported JSON includes structured spec data that AI assistants
# can use to understand project requirements, features, and goals
```

### Working with GitHub Copilot

```bash
# Create detailed project specification
vibe init --template library

# Generate implementation documentation
vibe gen

# Export for Copilot context
vibe export --format json --output library-spec.json

# Share the spec.json file with Copilot-enabled workspace
# for better code generation context
```

## 🚀 Advanced Usage

### Project Organization

```
📦 MyProject/
├── 📄 spec.yaml          # Current specification
├── 📄 README.md          # Generated documentation
├── 📄 spec.md            # Detailed spec documentation
└── 📦 .vibespec/         # Version snapshots
    ├── snapshots/
    │   ├── 1.0.0-YYYY-MM-DD.json
    │   └── 1.1.0-YYYY-MM-DD.json
    └── templates/        # Custom templates
        ├── my-api.yaml
        └── microservice-variant.yaml
```

### Workflow Automation

Create scripts for your workflow:

```bash
#!/bin/bash
# validate-and-export.sh

# Validate specification
vibe validate

# Generate documentation
vibe gen

# Export for AI tools
vibe export --format json --output "ai-context-$(date +%Y%m%d).json"

echo "✅ Specification validated and AI context exported!"
```

### Custom Templates in Git

Store custom templates in your project:

```bash
# Add templates to version control
mkdir templates
vibe template create my-company-web --file templates/
git add templates/
```

## 🤝 Contributing

### Development Setup

```bash
# Clone the repository
git clone https://github.com/nom-nom-hub/vibespec.git
cd vibespec

# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev

# Run tests
npm test
```

### Adding New Templates

1. Create a new template file in `/templates/my-template.yaml`
2. Follow the template metadata format
3. Test with `vibe init --template my-template`
4. Validate with `vibe validate`
5. Add documentation in the template's metadata

### Template Guidelines

- **Descriptive Names**: Use kebab-case (e.g., `ai-agent`, `data-pipeline`)
- **Comprehensive Goals**: Include 4-6 specific, measurable goals
- **Detailed Features**: Each feature should have 3-5 requirements
- **Metadata**: Include category, type, dependencies, and tags
- **Validation**: Ensure templates generate valid specifications

## 📝 Specification Format

### Basic Structure

```yaml
project: "Project Name"
version: "1.0.0"
description: >
  Multi-line project description

goals:
  - Goal 1: Be specific and measurable
  - Goal 2: Focus on outcomes
  - Goal 3: Align with business objectives

constraints:
  - Technical constraint 1
  - Business constraint 2
  - Operational constraint 3

features:
  - name: "Feature Name"
    description: "Brief feature description"
    requirements:
      - Requirement 1
      - Requirement 2
      - Requirement 3
```

### Best Practices

- **Clear Goals**: Goals should be specific, measurable, achievable, relevant, and time-bound
- **Detailed Requirements**: Each requirement should be testable and unambiguous
- **Logical Structure**: Group related requirements under cohesive features
- **Version Control**: Use semantic versioning for spec changes
- **Documentation**: Include comprehensive descriptions for all features

## 🔒 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**Template not found**: Ensure you're using a valid template name. Run `vibe template list` to see available options.

**Validation errors**: Check your YAML syntax and ensure all required fields are present.

**Export file path**: Make sure the output directory exists and is writable.

**Custom template not loading**: Check file permissions and YAML syntax for custom templates.

### Getting Help

- 📖 **Documentation**: This README and template documentation
- 🐛 **Issues**: [GitHub Issues](https://github.com/nom-nom-hub/vibespec/issues)
- ✉️ **Discussions**: [GitHub Discussions](https://github.com/nom-nom-hub/vibespec/discussions)
- 📞 **Support**: Contact via GitHub Issues

## 🎯 Roadmap

### Upcoming Features

- [ ] **AI Agent Integration**: Direct integration with popular AI coding assistants
- [ ] **Web Interface**: Browser-based specification editor
- [ ] **Template Marketplace**: Community template sharing
- [ ] **Advanced Diffing**: Sophisticated specification comparison
- [ ] **Implementation Tracking**: Link code to specific requirements
- [ ] **Multi-Language Export**: Export to formats beyond JSON/YAML

### Community Feedback

Help improve VibeSpec by sharing your:
- Custom templates and workflows
- Integration experiences
- Feature suggestions
- Bug reports

---

**Made with ❤️ for developers who value structure and collaboration**

[🐙 GitHub](https://github.com/nom-nom-hub/vibespec) • [📚 Documentation](./docs/)