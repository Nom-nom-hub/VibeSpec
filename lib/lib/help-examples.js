"use strict";
/**
 * Help examples and onboarding content for VibeSpec
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.helpExamples = void 0;
exports.getExampleHelp = getExampleHelp;
exports.getOnboardingSteps = getOnboardingSteps;
exports.getCommandQuickTip = getCommandQuickTip;
exports.helpExamples = {
    init: [
        'vibe init  # Create basic spec.yaml',
        'vibe init --template api  # Start with API spec',
        'vibe init --force  # Overwrite existing spec',
    ],
    validate: [
        'vibe validate  # Check current spec.yaml',
        'vibe validate --file spec.yaml  # Custom file',
        'vibe validate --verbose  # Detailed feedback',
    ],
    gen: [
        'vibe gen  # Generate Markdown to console',
        'vibe gen --format txt --output docs/  # Generate text file',
        'vibe gen --validate-only  # Check spec without generating',
    ],
    diff: [
        'vibe diff old.yaml new.yaml  # Compare specs',
        'vibe diff old.yaml new.yaml --show-summary  # With stats',
    ],
    trace: [
        'vibe trace  # Show feature → requirement mapping',
        'vibe trace --format list  # Alternative list view',
    ],
    ai: [
        'vibe ai --suggest-missing  # Get spec improvement tips',
        'vibe ai --generate-tests  # Generate test ideas',
        'vibe ai --summarize  # Create AI-ready project summary',
    ],
};
function getExampleHelp(commandName) {
    const examples = exports.helpExamples[commandName];
    if (!examples)
        return '';
    let help = '\n📚 Examples:\n';
    examples.forEach(example => {
        help += `  ${example}\n`;
    });
    return help;
}
function getOnboardingSteps() {
    return `
🎯 Getting Started with VibeSpec:

1. 🔄 Initialize your project
   vibe init
   # Creates spec.yaml template

2. ✏️ Edit your specification
   # Customize goals, features, requirements

3. ✅ Validate your spec
   vibe validate --verbose
   # Check for completeness and errors

4. 📝 Generate documentation
   vibe gen --format md --output docs/
   # Create professional docs

5. 🤖 Get AI assistance
   vibe ai --suggest-missing
   # Find areas needing improvement

6. 🔄 Compare versions
   vibe diff v1.yaml v2.yaml
   # Track specification changes

🚀 Pro Tip: Run 'vibe' without commands to see all available options!`;
}
function getCommandQuickTip(commandName) {
    const tips = {
        init: '💡 Use --template to start with different spec types',
        validate: '💡 Use --verbose for detailed feedback on your spec',
        gen: '💡 Use --validate-only to check spec without generating docs',
        diff: '💡 Use --show-summary for quick change statistics',
        trace: '💡 Use --format list for a cleaner hierarchical view',
        ai: '💡 Start with --suggest-missing for new spec guidance',
    };
    return tips[commandName] || '';
}
