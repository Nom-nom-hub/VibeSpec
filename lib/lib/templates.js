"use strict";
/**
 * File-based spec templates for different project types
 * Templates are loaded from YAML files in the templates directory
 */
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
exports.templates = void 0;
exports.setTemplateDirectory = setTemplateDirectory;
exports.loadTemplate = loadTemplate;
exports.getAvailableTemplates = getAvailableTemplates;
exports.getTemplate = getTemplate;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const yaml = __importStar(require("js-yaml"));
// Cache for loaded templates
let templatesCache = new Map();
let lastCacheRefresh = 0;
const CACHE_TTL = 30000; // 30 seconds
// Default template directory (can be overridden to use ~/.vibespec/templates/)
let templateDir = path.join(__dirname, '../../templates');
/**
 * Set the template directory path
 */
function setTemplateDirectory(dirPath) {
    templateDir = dirPath;
    // Clear cache when directory changes
    templatesCache = new Map();
    lastCacheRefresh = 0;
}
/**
 * Load a template from YAML file
 */
async function loadTemplateFile(templateType) {
    const templatePath = path.join(templateDir, `${templateType}.yaml`);
    // Check cache first
    const now = Date.now();
    if (templatesCache.has(templatePath) && now - lastCacheRefresh < CACHE_TTL) {
        return templatesCache.get(templatePath);
    }
    // Load and parse template file
    const fileContent = await fs.readFile(templatePath, 'utf8');
    const templateData = yaml.load(fileContent);
    const templateFile = {
        metadata: templateData.metadata,
        templateConfig: templateData.templateConfig,
        content: templateData.content
    };
    // Cache the template
    templatesCache.set(templatePath, templateFile);
    lastCacheRefresh = now;
    return templateFile;
}
/**
 * Load template from file and return Template interface
 */
async function loadTemplate(templateType) {
    try {
        const templateFile = await loadTemplateFile(templateType);
        return {
            name: templateFile.metadata?.name || templateType,
            description: templateFile.metadata?.description || `Template for ${templateType}`,
            content: templateFile.content,
            metadata: templateFile.metadata
        };
    }
    catch (error) {
        return null;
    }
}
/**
 * Get all available templates from the templates directory
 */
async function getAvailableTemplates() {
    try {
        const files = await fs.readdir(templateDir);
        const templates = [];
        for (const file of files) {
            if (path.extname(file) === '.yaml') {
                const templateName = path.basename(file, '.yaml');
                try {
                    const template = await loadTemplate(templateName);
                    if (template) {
                        templates.push({
                            type: templateName,
                            name: template.name,
                            description: template.description
                        });
                    }
                }
                catch (error) {
                    // Skip invalid template files
                    continue;
                }
            }
        }
        return templates.sort((a, b) => a.type.localeCompare(b.type));
    }
    catch (error) {
        return [];
    }
}
/**
 * Get a template by name (lazy loading)
 */
async function getTemplate(type) {
    return loadTemplate(type);
}
// For backward compatibility - dynamic Record that loads on demand
exports.templates = new Proxy({}, {
    get: (_, prop) => {
        if (typeof prop === 'string') {
            return loadTemplate(prop);
        }
        return undefined;
    }
});
