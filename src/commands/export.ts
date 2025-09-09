import { Command } from 'commander';
import * as fs from 'fs-extra';
import * as path from 'path';
import { createCommand, success, cliError, info } from '../lib/cli';
import { loadSpec, validateSpec } from '../lib/spec-parser';

type ExportFormat = 'json' | 'csv' | 'yaml';

export const exportCommand = createCommand('export', 'Export spec to different formats (JSON, CSV, YAML)')
  .option('-f, --format <type>', 'export format (json, csv, yaml)', 'json')
  .option('-o, --output <file>', 'output file path (default: auto-generated)')
  .option('--config <path>', 'path to spec file (default: "spec.yaml")', 'spec.yaml')
  .action(async (options) => {
    try {
      const specPath = path.resolve(process.cwd(), options.config);
      const format = options.format as ExportFormat;

      // Validate format
      const validFormats = ['json', 'csv', 'yaml'];
      if (!validFormats.includes(format)) {
        cliError(`Invalid export format: ${format}`);
        info('Available formats: json, csv, yaml');
        process.exit(1);
      }

      // Load and validate spec
      const spec = await loadSpec(specPath);
      const validation = validateSpec(spec);

      if (!validation.valid) {
        cliError('Spec validation failed. Cannot export invalid spec:');
        validation.errors.forEach(error => {
          cliError(`  • ${error}`);
        });
        if (validation.warnings && validation.warnings.length > 0) {
          info('Warnings:');
          validation.warnings.forEach(warning => {
            info(`  • ${warning}`);
          });
        }
        process.exit(1);
      }

      // Generate output file path
      const baseName = path.basename(specPath, path.extname(specPath));
      const outputPath = options.output || `${baseName}.${format}`;

      // Export based on format
      switch (format) {
        case 'json':
          await exportToJson(spec, outputPath);
          break;
        case 'csv':
          await exportToCsv(spec, outputPath);
          break;
        case 'yaml':
          await exportToYaml(spec, outputPath);
          break;
      }

      success(`✅ Exported spec to ${outputPath} (${format} format)`);
      info(`📊 Spec: ${spec.project} v${spec.version}`);
      info(`🎯 Goals: ${spec.goals?.length || 0}`);
      info(`⚙️ Features: ${spec.features?.length || 0}`);

    } catch (err) {
      cliError(`Export failed: ${(err as Error).message}`);
      info('💡 Troubleshooting:');
      info('   • Check that the spec file exists and is valid');
      info('   • Use --config to specify a different spec file');
      info('   • Ensure output directory is writable');
      process.exit(1);
    }
  });

async function exportToJson(spec: any, outputPath: string): Promise<void> {
  const jsonContent = JSON.stringify(spec, null, 2);
  await fs.writeFile(outputPath, jsonContent, 'utf8');
}

async function exportToCsv(spec: any, outputPath: string): Promise<void> {
  const rows: string[] = [];

  // Header
  rows.push('Project,Version,Description');

  // Basic info
  rows.push(`"${spec.project}","${spec.version}","${(spec.description || '').replace(/"/g, '""')}"`);

  // Goals
  if (spec.goals && spec.goals.length > 0) {
    spec.goals.forEach((goal: string, index: number) => {
      rows.push(`GOAL${index + 1},,"${goal.replace(/"/g, '""')}"`);
    });
  }

  // Features
  if (spec.features && spec.features.length > 0) {
    spec.features.forEach((feature: any) => {
      rows.push(`FEATURE,"${feature.name}","${(feature.description || '').replace(/"/g, '""')}"`);

      if (feature.requirements && feature.requirements.length > 0) {
        feature.requirements.forEach((req: string) => {
          rows.push(`REQUIREMENT,,"${req.replace(/"/g, '""')}"`);
        });
      }
    });
  }

  await fs.writeFile(outputPath, rows.join('\n'), 'utf8');
}

async function exportToYaml(spec: any, outputPath: string): Promise<void> {
  const yaml = require('js-yaml');
  const yamlContent = yaml.dump(spec, {
    indent: 2,
    lineWidth: -1,
    noRefs: true
  });
  await fs.writeFile(outputPath, yamlContent, 'utf8');
}