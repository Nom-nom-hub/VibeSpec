/**
 * GitHub Copilot IDE Integration
 * 
 * This module provides integration with GitHub Copilot by creating
 * context files and using GitHub's context mechanisms.
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { IDEIntegration, IDEIntegrationConfig, IDEContext } from './IDEIntegrationInterface';
import { VibeSpec } from '../spec-parser';

/**
 * GitHub Copilot IDE Integration
 * 
 * Copilot can use context from special files and GitHub's context system.
 * This integration creates those files with VibeSpec information.
 */
export class CopilotIDEIntegration extends IDEIntegration {
  private contextFiles: {
    markdown: string;
    json: string;
    instructions: string;
  };
  
  constructor(config: IDEIntegrationConfig) {
    super(config);
    const contextDir = this.getContextDir();
    this.contextFiles = {
      markdown: path.join(contextDir, 'copilot-context.md'),
      json: path.join(contextDir, 'copilot-context.json'),
      instructions: path.join(contextDir, 'copilot-instructions.txt')
    };
  }
  
  /**
   * Initialize Copilot IDE integration
   */
  async initialize(): Promise<void> {
    await this.ensureContextDir();
  }
  
  /**
   * Create context for Copilot
   */
  async createContext(spec: VibeSpec): Promise<IDEContext> {
    const context: IDEContext = {
      project: {
        name: spec.project || 'Untitled Project',
        version: spec.version,
        description: spec.description
      },
      goals: spec.goals || [],
      constraints: spec.constraints || [],
      features: (spec.features || []).map(feature => ({
        name: feature.name,
        description: feature.description,
        requirements: feature.requirements || [],
        flows: (feature.flows || []).map(flow => ({
          name: flow.name,
          description: flow.description,
          steps: flow.steps || []
        }))
      })),
      implementation: {
        cwd: process.cwd(),
        recentFiles: []
      },
      aiInstructions: {
        guidelines: [
          'Follow the specification exactly as described',
          'Ask for clarification if requirements are unclear',
          'Implement features incrementally',
          'Write secure, maintainable code',
          'Include appropriate comments and documentation'
        ],
        doNotDo: {
          do: [
            'Implement all specified requirements',
            'Follow established coding standards',
            'Write unit tests for new functionality',
            'Handle errors gracefully',
            'Optimize for readability over cleverness'
          ],
          dont: [
            'Skip validation or error handling',
            'Ignore security considerations',
            'Write overly complex solutions',
            'Deviate from the specification without approval'
          ]
        },
        patterns: [
          'Use clear, descriptive variable names',
          'Follow single responsibility principle',
          'Implement proper separation of concerns',
          'Write self-documenting code with good structure'
        ]
      }
    };
    
    this.context = context;
    return context;
  }
  
  /**
   * Write context to Copilot-specific files
   */
  async writeContext(context: IDEContext): Promise<void> {
    await this.ensureContextDir();
    
    // Create markdown context file
    const markdownContent = this.generateMarkdownContext(context);
    await fs.writeFile(this.contextFiles.markdown, markdownContent, 'utf8');
    
    // Create JSON context file
    await fs.writeJson(this.contextFiles.json, context, { spaces: 2 });
    
    // Create instructions file for Copilot
    const instructionsContent = this.generateInstructions(context);
    await fs.writeFile(this.contextFiles.instructions, instructionsContent, 'utf8');
  }
  
  /**
   * Update context with changes
   */
  async updateContext(changes: Partial<IDEContext>): Promise<void> {
    if (!this.context) {
      throw new Error('Context not initialized. Call createContext first.');
    }
    
    // Merge changes into existing context
    this.context = { ...this.context, ...changes };
    
    // Write updated context
    await this.writeContext(this.context);
  }
  
  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    // Nothing to cleanup for Copilot
  }
  
  /**
   * Generate markdown content for Copilot context
   */
  private generateMarkdownContext(context: IDEContext): string {
    let content = `# VibeSpec Context for GitHub Copilot

`;
    
    content += `## Project Overview
`;
    content += `**Project**: ${context.project.name}

`;
    if (context.project.description) {
      content += `**Description**: ${context.project.description}

`;
    }
    content += `
`;
    
    if (context.goals.length > 0) {
      content += `## Objectives
`;
      context.goals.forEach((goal, index) => {
        content += `${index + 1}. ${goal}
`;
      });
      content += `
`;
    }
    
    if (context.constraints.length > 0) {
      content += `## Constraints & Limitations
`;
      context.constraints.forEach((constraint, index) => {
        content += `- ${constraint}
`;
      });
      content += `
`;
    }
    
    if (context.features.length > 0) {
      content += `## Features to Implement
`;
      context.features.forEach((feature: any, featureIndex: number) => {
        content += `### Feature ${featureIndex + 1}: ${feature.name}
`;
        if (feature.description) {
          content += `**Description**: ${feature.description}

`;
        }
        
        if (feature.requirements.length > 0) {
          content += `**Requirements**:
`;
          feature.requirements.forEach((req: string, reqIndex: number) => {
            content += `${reqIndex + 1}. ${req}
`;
          });
          content += `
`;
        }
        
        if (feature.flows && feature.flows.length > 0) {
          content += `**Implementation Steps**:
`;
          feature.flows.forEach((flow: any, flowIndex: number) => {
            content += `${flowIndex + 1}. **${flow.name}**: ${flow.description || ''}
`;
            if (flow.steps && flow.steps.length > 0) {
              flow.steps.forEach((step: string, stepIndex: number) => {
                content += `   - ${step}
`;
              });
            }
          });
          content += `
`;
        }
      });
    }
    
    content += `## Implementation Guidance
`;
    content += `- Current working directory: ${context.implementation.cwd}
`;
    content += `- Focus on one feature at a time
`;
    content += `- Ask for clarification when requirements are ambiguous
`;
    content += `- Write clean, well-tested code
`;
    
    return content;
  }
  
  /**
   * Generate instructions for Copilot
   */
  private generateInstructions(context: IDEContext): string {
    let instructions = `GitHub Copilot Context Instructions
`;
    instructions += `==================================

`;
    
    instructions += `PROJECT: ${context.project.name}
`;
    if (context.project.version) {
      instructions += `VERSION: ${context.project.version}
`;
    }
    instructions += `
`;
    
    instructions += `CONTEXT GUIDANCE:
`;
    instructions += `----------------
`;
    instructions += `You are an AI programming assistant working on a project with specific requirements.
`;
    instructions += `Your task is to help implement the features described in the specification.

`;
    
    if (context.aiInstructions?.guidelines) {
      instructions += `GENERAL GUIDELINES:
`;
      context.aiInstructions.guidelines.forEach(guideline => {
        instructions += `- ${guideline}
`;
      });
      instructions += `
`;
    }
    
    if (context.goals.length > 0) {
      instructions += `PROJECT GOALS:
`;
      context.goals.forEach(goal => {
        instructions += `- ${goal}
`;
      });
      instructions += `
`;
    }
    
    if (context.constraints.length > 0) {
      instructions += `CONSTRAINTS:
`;
      context.constraints.forEach(constraint => {
        instructions += `- ${constraint}
`;
      });
      instructions += `
`;
    }
    
    instructions += `WORKFLOW:
`;
    instructions += `---------
`;
    instructions += `1. Review the feature requirements carefully
`;
    instructions += `2. Ask clarifying questions if needed
`;
    instructions += `3. Implement one requirement at a time
`;
    instructions += `4. Write clean, well-documented code
`;
    instructions += `5. Include appropriate error handling
`;
    instructions += `6. Follow established project patterns

`;
    
    if (context.aiInstructions?.doNotDo) {
      instructions += `DO'S AND DON'TS:
`;
      instructions += `---------------
`;
      instructions += `DO:
`;
      context.aiInstructions.doNotDo.do.forEach(item => {
        instructions += `- ${item}
`;
      });
      instructions += `

`;
      
      instructions += `DON'T:
`;
      context.aiInstructions.doNotDo.dont.forEach(item => {
        instructions += `- ${item}
`;
      });
      instructions += `

`;
    }
    
    return instructions;
  }
}