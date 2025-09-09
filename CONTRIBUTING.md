# 🤝 Contributing to VibeSpec

Thank you for your interest in contributing to VibeSpec! We welcome contributions from developers of all skill levels. This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Adding Templates](#adding-templates)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Community](#community)

## 🤝 Code of Conduct

This project follows a code of conduct to ensure a welcoming environment for all contributors. By participating, you agree to:

- Be respectful and inclusive
- Focus on constructive feedback
- Accept responsibility for mistakes
- Show empathy towards other contributors
- Help create a positive community

## 🚀 Getting Started

### Prerequisites

- **Node.js 16+**: [Download here](https://nodejs.org/)
- **TypeScript 5.0+**: Installed automatically
- **Git**: For version control

### Setup Development Environment

```bash
# Fork and clone the repository
git clone https://github.com/nom-nom-hub/vibespec.git
cd vibespec

# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev
```

### Development Commands

```bash
# Build the project
npm run build

# Run in development mode with auto-reload
npm run dev

# Run linting
npm run lint

# Format code
npm run format

# Run tests
npm test
```

## 🔄 Development Workflow

### 1. Choose an Issue

- Check [GitHub Issues](https://github.com/nom-nom-hub/vibespec/issues) for tasks
- Look for `good first issue` and `help wanted` labels
- Comment on issues to indicate interest

### 2. Create a Branch

```bash
# Create and switch to feature branch
git checkout -b feature/your-feature-name

# Or create bug fix branch
git checkout -b fix/issue-number-description
```

### 3. Make Changes

- Follow the existing code style
- Add tests for new functionality
- Update documentation as needed
- Ensure commits are atomic and well-described

### 4. Test Your Changes

```bash
# Run tests
npm test

# Test your changes manually
node lib/index.js --help
vibe template list
vibe init --template default --force
```

### 5. Submit Pull Request

- Push your branch: `git push origin feature/your-feature-name`
- Create PR with clear description
- Reference related issues
- Request review from maintainers

## 🏗️ Project Structure

```
📦 VibeSpec/
├── 📄 package.json          # Project configuration
├── 📄 tsconfig.json         # TypeScript configuration
├── 📄 README.md             # Main documentation
├── 📄 CONTRIBUTING.md       # This file
├── 📄 .gitignore           # Git ignore patterns
├── 🔨 bin/
│   └── vibe.js            # CLI entry point
├── 📝 src/
│   ├── index.ts           # Main exports
│   ├── lib/
│   │   ├── cli.ts         # CLI utilities and helpers
│   │   ├── spec-parser.ts # YAML/JSON parsing and validation
│   │   ├── templates.ts   # Template loading and management
│   │   ├── snapshot-manager.ts # Version control system
│   │   └── enhanced-help.ts # Help system
│   └── commands/          # CLI command implementations
│       ├── init.ts        # Project initialization
│       ├── validate.ts    # Spec validation
│       ├── export.ts      # Format export functionality
│       ├── gen.ts         # Documentation generation
│       ├── template.ts    # Template management
│       ├── snapshot.ts    # Version control commands
│       └── ...            # Other commands
├── 🎯 templates/          # Built-in template files
│   ├── default.yaml       # Basic project template
│   ├── web-app.yaml       # Web application template
│   ├── ai-agent.yaml      # AI agent template
│   └── ...               # Other templates (12 total)
├── 🏗️ lib/               # Compiled JavaScript output
├── 📚 docs/               # Documentation files
└── 🧪 test-notes-app/     # Example project
```

## 🎨 Adding Templates

### Template Creation Process

1. **Design the Template**: Identify the use case and requirements
2. **Create Template File**: Add to `templates/` directory
3. **Follow Template Format**: Use consistent metadata and structure
4. **Test the Template**: Ensure it creates valid specifications
5. **Update Documentation**: Add to README.md template list

### Template File Format

```yaml
# Template metadata (required)
metadata:
  name: "Short Display Name"
  description: "Brief description (max 100 chars)"
  category: "Primary Category"  # e.g., "AI", "Web", "Mobile"
  type: "Technical Type"        # e.g., "application", "library", "service"
  version: "1.0.0"
  author: "Your Name"
  tags: ["relevant", "keywords"]
  dependencies: ["tech1", "tech2"]
  lastUpdated: "2025-01-01"
  compatibleWith: ["env1", "env2"]

# Template configuration
templateConfig:
  generateFrom: "content"
  variables: []  # Future: dynamic variables

# The actual specification template
content: |
  project: "Template Project Name"
  version: "1.0.0"
  description: >
    Detailed description of what this template creates

  goals:
    - Goal 1: Specific, measurable objective
    - Goal 2: Business or technical outcome
    - Goal 3: Quality or performance target

  constraints:
    - Technical constraint
    - Business constraint
    - Operational requirement

  features:
    - name: "Core Feature 1"
      description: "Brief description"
      requirements:
        - Specific requirement
        - Measurable criterion
        - Acceptance condition

    - name: "Core Feature 2"
      description: "Brief description"
      requirements:
        - Specific requirement
        - Measurable criterion
        - Acceptance condition
```

### Template Naming Conventions

- **File names**: kebab-case (e.g., `ai-agent.yaml`, `data-pipeline.yaml`)
- **Categories**: Choose from established categories (AI, Web, Mobile, Backend, etc.)
- **Descriptions**: Keep under 100 characters, clear, and action-oriented

### Template Validation

Before submitting:

```bash
# Test template creation
node bin/vibe.js init --template your-template --force

# Validate the generated spec
node bin/vibe.js validate

# Test export functionality
node bin/vibe.js export --format json
node bin/vibe.js export --format yaml
```

## 🧪 Testing Guidelines

### Test Coverage

- **Unit Tests**: Core functionality tests
- **Integration Tests**: Full workflow testing
- **Template Tests**: Verify all templates generate valid specs
- **Export Tests**: Test all export formats

### Manual Testing Checklist

```bash
# Template functionality
vibe template list                    # Shows all templates
vibe template show library           # Shows template details
vibe init --template web-app        # Creates project
vibe validate                        # Validates spec
vibe gen                            # Generates docs

# Export functionality
vibe export --format json           # JSON export
vibe export --format csv            # CSV export
vibe export --format yaml --output custom.yaml  # Custom filename

# Version control
vibe snapshot create "1.0.0"        # Create snapshot
vibe snapshot list                   # List snapshots
vibe snapshot show 1.0.0           # Show snapshot

# Custom templates
vibe template create my-template    # Create custom
vibe template delete my-template    # Delete custom
```

### Performance Testing

```bash
# Test template loading speed
time vibe template list

# Test large spec validation
time vibe validate --file large-spec.yaml

# Test export performance
time vibe export --format json --output large-export.json
```

## 🔄 Pull Request Process

### PR Requirements

✅ **Title**: Clear, descriptive title explaining the change
✅ **Description**: Detailed explanation of what and why
✅ **Issue Reference**: Link to related GitHub issue
✅ **Screenshots**: UI changes include before/after screenshots
✅ **Testing**: Manual testing steps and results
✅ **Code Review**: Address all review feedback

### PR Template

```markdown
## Description
Brief description of the changes

## Related Issues
Fixes #123, Addresses #456

## Testing
Describe how you tested these changes

## Screenshots
Add screenshots if UI changes were made

## Checklist
- [ ] Tests pass
- [ ] Documentation updated
- [ ] Code reviewed
- [ ] Ready for merge
```

## 📖 Documentation Guidelines

### Code Documentation

```typescript
/**
 * Function description
 * @param param - Parameter description
 * @returns Return value description
 * @example
 * const result = functionName(param);
 */
function functionName(param: string): boolean {
  // Implementation
}
```

### Template Documentation

```yaml
metadata:
  description: "Clear, actionable description"
  tags: ["relevant", "keywords", "for", "discovery"]
```

### README Updates

When adding features:
- Update feature list in README.md
- Add usage examples
- Update installation instructions if needed
- Add troubleshooting section for common issues

## 🎯 Best Practices

### Code Quality

- **TypeScript First**: Strong typing throughout
- **Clean Code**: Small functions, clear names
- **DRY Principle**: No code duplication
- **YAGNI**: Only implement what's needed

### Commit Messages

```bash
# Good commit messages
feat: add CSV export functionality
fix: correct template validation error
docs: update README installation guide
test: add template loading tests

# Less ideal
fixed bug
update
changes
```

### Code Style

- Follow existing patterns in the codebase
- Use Prettier and ESLint configurations
- Consistent naming conventions
- Clear separation of concerns

## 🌟 Community

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **Pull Request Reviews**: Code discussion and feedback

### Recognition

Contributors are recognized through:
- GitHub contributor statistics
- Acknowledgments in changelog
- Special mention in release notes
- Co-author credit on commits

### Getting Help

- **Documentation**: Check README.md and docs/
- **Issues**: Search existing GitHub issues
- **Discussions**: Community forum for questions
- **Email**: Contact maintainers directly for sensitive topics

---

## Thank You! 🎉

Your contributions help make VibeSpec better for everyone. Whether it's:
- 🐛 Fixing a bug
- ✨ Adding a feature
- 📚 Improving documentation
- 🧪 Writing tests
- 🎨 Designing templates

Every contribution counts and is appreciated by the community!

**Happy coding and thank you for contributing to VibeSpec!** 🚀