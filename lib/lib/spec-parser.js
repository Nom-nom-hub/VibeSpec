"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSpec = loadSpec;
exports.validateSpec = validateSpec;
exports.generateSpecFromText = generateSpecFromText;
const yaml = __importStar(require("js-yaml"));
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
/**
 * Load and parse a spec file (YAML/JSON/Markdown)
 */
async function loadSpec(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const content = await fs.readFile(filePath, 'utf-8');
    switch (ext) {
        case '.yaml':
        case '.yml':
            return yaml.load(content);
        case '.json':
            return JSON.parse(content);
        default:
            throw new Error(`Unsupported file format: ${ext}`);
    }
}
/**
 * Validate spec structure against expected format
 */
function validateSpec(spec) {
    const errors = [];
    const warnings = [];
    // Required fields
    if (!spec.project) {
        errors.push('Project name is required');
    }
    if (!spec.features || spec.features.length === 0) {
        errors.push('At least one feature is required');
    }
    // Feature validation
    if (spec.features) {
        spec.features.forEach((feature, index) => {
            if (!feature.name) {
                errors.push(`Feature ${index + 1}: name is required`);
            }
            if (!feature.requirements || feature.requirements.length === 0) {
                warnings.push(`Feature "${feature.name}": no requirements defined`);
            }
            // Flow validation
            if (feature.flows) {
                feature.flows.forEach((flow, flowIndex) => {
                    if (!flow.name) {
                        errors.push(`Feature "${feature.name}", flow ${flowIndex + 1}: name is required`);
                    }
                    if (!flow.steps || flow.steps.length === 0) {
                        warnings.push(`Feature "${feature.name}", flow "${flow.name}": no steps defined`);
                    }
                });
            }
        });
    }
    // Optional validations with warnings
    if (!spec.version) {
        warnings.push('Version not specified');
    }
    if (!spec.description) {
        warnings.push('Project description not specified');
    }
    if (!spec.goals || spec.goals.length === 0) {
        warnings.push('No project goals defined');
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}
/**
 * Generate spec from plain text description using AI assistance
 */
async function generateSpecFromText(text, aiAdapter) {
    // TODO: Implement AI integration for spec generation
    // This will use the adapter system to convert plain text to structured spec
    throw new Error('generateSpecFromText not yet implemented');
}
