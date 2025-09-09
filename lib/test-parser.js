"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spec_parser_1 = require("./lib/spec-parser");
async function testParser() {
    try {
        console.log('Testing spec parser with spec.yaml...');
        // Load and parse the spec
        const spec = await (0, spec_parser_1.loadSpec)('./spec.yaml');
        console.log('✓ Successfully loaded spec');
        console.log('Project:', spec.project);
        console.log('Version:', spec.version);
        console.log('Goals:', spec.goals?.length || 0);
        console.log('Features count:', spec.features?.length || 0);
        // Validate the spec
        const validation = (0, spec_parser_1.validateSpec)(spec);
        console.log('✓ Validated spec');
        console.log('Valid:', validation.valid);
        if (!validation.valid) {
            console.log('Errors:', validation.errors);
        }
        else {
            console.log('No validation errors found');
        }
        // Show some features
        if (spec.features && spec.features.length > 0) {
            console.log('\nFeatures:');
            spec.features.forEach((feature, index) => {
                console.log(`${index + 1}. ${feature.name}`);
                if (feature.description) {
                    console.log(`   Description: ${feature.description.substring(0, 50)}...`);
                }
                if (feature.requirements && feature.requirements.length > 0) {
                    console.log(`   Requirements: ${feature.requirements.length}`);
                }
                if (feature.flows && feature.flows.length > 0) {
                    console.log(`   Flows: ${feature.flows.length}`);
                }
            });
        }
        // Show goals
        if (spec.goals && spec.goals.length > 0) {
            console.log('\nGoals:');
            spec.goals.forEach((goal, index) => {
                console.log(`${index + 1}. ${goal}`);
            });
        }
        return spec;
    }
    catch (error) {
        const err = error;
        console.error('✗ Error testing parser:', err.message);
        console.error(err.stack);
        throw error;
    }
}
// Run the test
testParser().then((spec) => {
    console.log('\n✅ Parser test completed successfully!');
}).catch((error) => {
    console.error('\n❌ Parser test failed:', error.message);
    process.exit(1);
});
