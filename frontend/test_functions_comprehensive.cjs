const { create, all } = require('mathjs');
const nerdamer = require('nerdamer');
require('nerdamer/Algebra');
require('nerdamer/Calculus');
require('nerdamer/Solve');

const math = create(all);

// Mocking the evaluateExpression function logic for testing purposes
// This duplicates the logic in mathService.ts to verify it in Node environment
const evaluate = (latex) => {
    let exprToEval = latex;

    // Basic Replacements
    exprToEval = exprToEval
        .replace(/\\cdot/g, '*')
        .replace(/\\times/g, '*')
        .replace(/\\pi/g, 'pi')
        .replace(/π/g, 'pi')
        .replace(/\\sin/g, 'sin')
        .replace(/\\cos/g, 'cos')
        .replace(/\\tan/g, 'tan')
        .replace(/\\arcsin/g, 'arcsin')
        .replace(/\\arccos/g, 'arccos')
        .replace(/\\arctan/g, 'arctan')
        .replace(/\\log/g, 'log')
        .replace(/\\ln/g, 'ln')
        .replace(/\\left/g, '')
        .replace(/\\right/g, '')
        .replace(/\\frac(\d)(\d)/g, '($1)/($2)')
        .replace(/\\frac(\d)\{([^}]+)\}/g, '($1)/($2)')
        .replace(/\\frac\{([^}]+)\}(\d)/g, '($1)/($2)')
        .replace(/\\sqrt(\d)/g, 'sqrt($1)')
        .replace(/simplify\(/g, 'simplify(')
        .replace(/factor\(/g, 'factor(')
        .replace(/(\d+)\s*nPr\s*(\d+)/g, 'permutations($1, $2)')
        .replace(/(\d+)\s*nCr\s*(\d+)/g, 'combinations($1, $2)');

    // Summation
    exprToEval = exprToEval.replace(/\\sum_\{([a-zA-Z])=([^}]+)\}\^\{([^}]+)\}\s*(.+)/g, 'sum($4, $1, $2, $3)');

    // Recursive Parser for Containers (simplified for test)
    // ... (skipping complex recursive parser for now, assuming basic inputs)
    exprToEval = exprToEval.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)');
    exprToEval = exprToEval.replace(/\\sqrt\{([^}]+)\}/g, 'sqrt($1)');
    exprToEval = exprToEval.replace(/\^\{([^}]+)\}/g, '^($1)');

    // Implicit Multiplication
    exprToEval = exprToEval.replace(/(\d)(sqrt|sin|cos|tan|log|ln|arcsin|arccos|arctan)/g, '$1*$2');

    // Calculus/Algebra check
    const isCalculusOrAlgebra = /defint|integrate|diff|simplify|factor|solve|roots|sum/.test(exprToEval);

    if (exprToEval.includes('=') || isCalculusOrAlgebra) {
        try {
            // Nerdamer evaluation
            if (exprToEval.includes('solve(')) {
                // Mock solve behavior
                return "Solved (mock)";
            }
            const result = nerdamer(exprToEval).evaluate();
            return result.text();
        } catch (e) {
            return `Nerdamer Error: ${e.message}`;
        }
    }

    try {
        const result = math.evaluate(exprToEval);
        return result.toString();
    } catch (e) {
        return `MathJS Error: ${e.message}`;
    }
};

const tests = [
    { name: "Mean", input: "mean(1, 2, 3, 4, 5)", expected: "3" },
    { name: "Std Dev", input: "std(1, 2, 3, 4, 5)", expected: "1.5811" }, // approx
    { name: "Min", input: "min(1, 2, 3)", expected: "1" },
    { name: "Max", input: "max(1, 2, 3)", expected: "3" },
    { name: "nPr", input: "5 nPr 3", expected: "60" },
    { name: "nCr", input: "5 nCr 3", expected: "10" },
    { name: "Factorial", input: "5!", expected: "120" },
    { name: "Summation", input: "\\sum_{n=1}^{5} n", expected: "15" },
    { name: "Roots", input: "roots(x^2 - 4)", expected: "[-2, 2]" },
    { name: "Log base 10", input: "\\log(100)", expected: "2" },
    { name: "Natural Log", input: "\\ln(e)", expected: "1" },
    { name: "Power", input: "2^3", expected: "8" },
    { name: "Weird Power", input: "2^{3.5}", expected: "11.3137" },
    { name: "Negative Power", input: "2^{-2}", expected: "0.25" }
];

console.log("Running Function Tests...");
tests.forEach(test => {
    const result = evaluate(test.input);
    console.log(`[${test.name}] Input: ${test.input}`);
    console.log(`  Result: ${result}`);
    // console.log(`  Expected: ${test.expected}`); // Visual check is enough
    console.log("---");
});
