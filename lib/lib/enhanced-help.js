"use strict";
/**
 * Enhanced help system with examples, tips, and context
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.helpExamples = void 0;
exports.getEnhancedHelp = getEnhancedHelp;
exports.getCommandReference = getCommandReference;
exports.addExamplesToCommander = addExamplesToCommander;
exports.helpExamples = {
    init: {
        title: 'Initialize a new VibeSpec project',
        description: 'Set up a new project with templates and scaffolding',
        examples: [
            'vibe init --template default  # Basic project with common features',
            'vibe init --template api      # API-first project structure',
            'vibe init --template prd      # Product requirements document',
            'vibe init --force            # Overwrite existing spec.yaml',
        ],
        tips: [
            'Use --template to start with different project types',
            'Templates automatically include validation and structure',
            'Run "vibe validate" after initialization to check your setup'
        ]
    },
    validate: {
        title: 'Validate spec.yaml structure',
        description: 'Check specification for errors, warnings, and completeness',
        examples: [
            'vibe validate                 # Validate current directory spec.yaml',
            'vibe validate --file spec.yaml --verbose  # Detailed feedback',
            'vibe validate --file specs/v1.0.yaml     # Custom file path',
        ],
        tips: [
            'Use --verbose to see detailed feedback and suggestions',
            'Pass validation before generating documentation or AI prompts',
            'Warnings help improve your spec before final implementation'
        ]
    },
    gen: {
        title: 'Generate documentation',
        description: 'Convert spec.yaml into formatted documentation',
        examples: [
            'vibe gen --format md        # Markdown docs to console',
            'vibe gen --format md --output docs/  # Save to file',
            'vibe gen --format txt       # Plain text format',
            'vibe gen --validate-only    # Check without generating',
        ],
        tips: [
            'Use --output docs/ to save to specific directory',
            'Markdown format supports GitHub, GitLab integration',
            'Use --validate-only to check spec without file generation'
        ]
    },
    diff: {
        title: 'Compare spec versions',
        description: 'Show differences between two specification files',
        examples: [
            'vibe diff old.yaml new.yaml   # Basic comparison',
            'vibe diff v1.0.yaml v2.0.yaml --show-summary  # With stats',
            'vibe diff spec.yaml backup.yaml  # Compare with backup',
        ],
        tips: [
            'Use --show-summary for quick overview of changes',
            'Exit code indicates if differences were found (useful for CI/CD)',
            'Great for tracking specification evolution over time'
        ]
    },
    trace: {
        title: 'Trace feature requirements',
        description: 'Show hierarchical mapping of features to requirements',
        examples: [
            'vibe trace                   # Table format (default)',
            'vibe trace --format list     # Numbered list format',
            'vibe trace --file custom.yaml # Specific spec file',
        ],
        tips: [
            'Use --format list for easier reading in terminals',
            'Table format is great for documentation and presentations',
            'Helps identify missing flows or incomplete requirements'
        ]
    },
    ai: {
        title: 'AI integration support',
        description: 'Generate context, tests, and suggestions for AI coding assistants',
        examples: [
            'vibe ai --suggest-missing     # Get spec improvement suggestions',
            'vibe ai --generate-tests      # Create test case ideas',
            'vibe ai --summarize           # Generate concise AI context',
            'vibe ai --file spec.yaml --summarize  # Custom file',
        ],
        tips: [
            '--suggest-missing helps identify spec gaps before implementation',
            '--generate-tests creates structured test ideas based on features',
            '--summarize creates ready-to-copy context for AI tools like ChatGPT'
        ]
    },
    plan: {
        title: 'Generate implementation plan',
        description: 'Create development roadmap from specification',
        examples: [
            'vibe plan                     # Generate implementation plan',
            'vibe plan --output plan.md   # Save to Markdown file',
            'vibe plan --file spec.yaml    # From specific spec file',
        ],
        tips: [
            'Plans include milestones and dependencies',
            'Perfect for team planning and sprint preparation',
            'Integrates with issue trackers and project management tools'
        ]
    },
    tasks: {
        title: 'Manage development tasks',
        description: 'Track and organize tasks derived from requirements',
        examples: [
            'vibe tasks                    # Show current tasks',
            'vibe tasks --status completed # Filter by status',
            'vibe tasks --by-feature Rich Editor  # Group by feature',
        ],
        tips: [
            'Tasks automatically link to specific requirements',
            'Filter by multiple criteria to focus work',
            'Integrated with progress tracking and reporting'
        ]
    },
    run: {
        title: 'Execute tasks with AI assistance',
        description: 'Run development tasks with AI-powered implementation support',
        examples: [
            'vibe run --task "Add rich text editor"',
            'vibe run --suggest-missing-features',
            'vibe run --generate-tests "user-auth"',
            'vibe run --fix-validation-errors',
        ],
        tips: [
            'Combines task execution with AI-powered code generation',
            'Automatically handles dependencies between tasks',
            'Provides code reviews and improvement suggestions'
        ]
    },
    check: {
        title: 'Validate implementation',
        description: 'Check if actual code matches specification requirements',
        examples: [
            'vibe check                    # Check current implementation',
            'vibe check --coverage        # Detailed coverage report',
            'vibe check --output report.md # Generate report',
            'vibe check --fix             # Auto-fix minor issues',
        ],
        tips: [
            'Compares codebase against specification for drift detection',
            'Use --coverage to see implementation completeness percentage',
            'Report shows requirements vs actual implementation status'
        ]
    },
    coverage: {
        title: 'Show implementation coverage',
        description: 'Calculate percentage of spec requirements implemented',
        examples: [
            'vibe coverage                # Overall coverage report',
            'vibe coverage --by-feature   # Detailed feature breakdown',
            'vibe coverage --chart        # Visual coverage chart',
            'vibe coverage --output chart.html # Save interactive chart',
        ],
        tips: [
            'Shows implementation completeness at feature and requirement levels',
            'Charts help visualize progress for stakeholders',
            'Identify high-priority unimplemented features'
        ]
    },
    refine: {
        title: 'Refine specification',
        description: 'Improve and optimize existing spec for better implementation',
        examples: [
            'vibe refine                   # Analyze and suggest improvements',
            'vibe refine --fix-issues     # Apply automated fixes',
            'vibe refine --output refined.yaml  # Save improved version',
            'vibe refine --focus=on-features  # Target specific improvements',
        ],
        tips: [
            'Finds redundancy, unclear requirements, and missing constraints',
            'Auto-fixes common specification issues',
            'Creates cleaner, more implementable specifications'
        ]
    }
};
/**
 * Get enhanced help for a command
 */
function getEnhancedHelp(commandName) {
    const help = exports.helpExamples[commandName];
    if (!help)
        return '';
    let output = '';
    output += `🚀 ${help.title}\n`;
    output += `📝 ${help.description}\n\n`;
    if (help.examples && help.examples.length > 0) {
        output += `📚 Examples:\n`;
        help.examples.forEach((example, index) => {
            output += `   ${example}\n`;
        });
        output += '\n';
    }
    if (help.tips && help.tips.length > 0) {
        output += `💡 Tips:\n`;
        help.tips.forEach((tip, index) => {
            output += `   • ${tip}\n`;
        });
        output += '\n';
    }
    return output;
}
/**
 * Get quick command reference
 */
function getCommandReference() {
    let output = '';
    output += `🔧 VibeSpec Command Reference
═`.repeat(30) + '\n';
    output += `📋 CORE COMMANDS:
   init       Initialize project with templates
   validate   Check spec for errors and completeness
   gen        Generate docs (Markdown, Text, JSON)
   diff       Compare spec versions and files
   trace      Map features to requirements hierarchy

🔮 AI COMMANDS:
   ai         Generate AI prompts, tests, and suggestions
   plan       Create implementation roadmap
   check      Validate implementation against spec
   coverage   Show implementation completeness

🛠️ ADVANCED:
   tasks      Track requirement-derived tasks
   run        Execute tasks with AI assistance
   refine     Optimize and improve specifications

💡 Use "vibe command --help" for detailed help

📚 Quick Start:
   vibe init --template default
   vibe validate --verbose
   vibe gen --format md --output docs/
   vibe ai --summarize | pbcopy  # Copy to clipboard for AI tools!`;
    return output;
}
/**
 * Add examples to commander command
 */
function addExamplesToCommander(cmd, commandName) {
    const help = exports.helpExamples[commandName];
    if (help && help.examples) {
        cmd.addHelpText('after', '\n📚 Examples:\n' + help.examples.map(ex => `  ${ex}`).join('\n'));
    }
    if (help && help.tips) {
        cmd.addHelpText('after', '\n💡 Tips:\n' + help.tips.map(tip => `  • ${tip}`).join('\n'));
    }
}
