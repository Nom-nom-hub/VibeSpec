"use strict";
/**
 * IDE Integration Factory
 *
 * This module creates IDE integration instances based on the IDE type.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDEIntegrationFactory = void 0;
const CursorIDEIntegration_1 = require("./CursorIDEIntegration");
const CopilotIDEIntegration_1 = require("./CopilotIDEIntegration");
class IDEIntegrationFactory {
    /**
     * Create an IDE integration instance
     */
    static create(ideType, config) {
        switch (ideType) {
            case 'cursor':
                return new CursorIDEIntegration_1.CursorIDEIntegration(config);
            case 'copilot':
                return new CopilotIDEIntegration_1.CopilotIDEIntegration(config);
            default:
                throw new Error(`Unsupported IDE type: ${ideType}`);
        }
    }
    /**
     * Check if an IDE type is supported
     */
    static isSupported(ideType) {
        const supportedTypes = ['cursor', 'copilot'];
        return supportedTypes.includes(ideType);
    }
    /**
     * Get all supported IDE types
     */
    static getSupportedTypes() {
        return ['cursor', 'copilot'];
    }
}
exports.IDEIntegrationFactory = IDEIntegrationFactory;
