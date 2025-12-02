const { create, all } = require('mathjs');
const math = create(all);

// Mock function to simulate the logic we want to implement
const evaluateWithSubstitution = (input) => {
    console.log(`Testing input: "${input}"`);

    // Regex to match: expression, var=value
    // We need to be careful about the comma. It should be the last comma that separates the var definition.
    // Pattern: anything, variable = value
    // But value could be "2+2".
    // Let's try splitting by comma first, but that's dangerous if expression has commas (like functions).
    // Better regex: /^(.*),\s*([a-zA-Z])\s*=\s*(.+)$/

    const substitutionRegex = /^(.*),\s*([a-zA-Z])\s*=\s*(.+)$/;
    const match = input.match(substitutionRegex);

    let exprToEval = input;
    let scope = {};

    if (match) {
        const mainExpr = match[1];
        const varName = match[2];
        const valExpr = match[3];

        console.log(`  Found substitution: ${varName} = ${valExpr}`);
        console.log(`  Main expression: ${mainExpr}`);

        try {
            // Evaluate the value expression first
            const valResult = math.evaluate(valExpr);
            scope[varName] = valResult;
            console.log(`  Resolved ${varName} to ${valResult}`);
            exprToEval = mainExpr;
        } catch (e) {
            console.log(`  Error evaluating value for ${varName}: ${e.message}`);
            return null;
        }
    } else {
        console.log("  No substitution pattern found.");
    }

    // Basic cleanup for the test (simplified version of actual service)
    exprToEval = exprToEval.replace(/\\cdot/g, '*');

    try {
        const result = math.evaluate(exprToEval, scope);
        console.log(`  Result: ${result}`);
        return result;
    } catch (e) {
        console.log(`  Evaluation Error: ${e.message}`);
        return null;
    }
};

// Test cases
evaluateWithSubstitution("(x^2 + 1), x=5");
evaluateWithSubstitution("2*y, y=10");
evaluateWithSubstitution("x+1, x=2+2");
evaluateWithSubstitution("sin(t), t=90 deg"); // mathjs might need unit config for this, but logic check is main goal
evaluateWithSubstitution("2\\cdot x, x=3");
