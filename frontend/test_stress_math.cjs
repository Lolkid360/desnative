const { create, all } = require('mathjs');
const nerdamer = require('nerdamer');
require('nerdamer/Algebra');
require('nerdamer/Calculus');
require('nerdamer/Solve');

const math = create(all);

// Mocking the evaluateExpression function logic for testing purposes
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

    // Integrals
    exprToEval = exprToEval.replace(/\\int_\{([^}]+)\}\^\{([^}]+)\}\s*(.+?)\s*(?:\\,|\\:|\\;|\\s)*\\?(?:mathrm\{)?d\}?([a-z])/g, 'defint($3, $4, $1, $2)');
    exprToEval = exprToEval.replace(/\\int\s*(.+?)\s*(?:\\,|\\:|\\;|\\s)*\\?(?:mathrm\{)?d\}?([a-z])/g, 'integrate($1, $2)');

    // Derivatives
    // d^n/dx^n
    exprToEval = exprToEval.replace(/\\frac\s*\{\s*\\?(?:mathrm\{)?d\}?\s*\^\s*\{?(\d+)\}?\s*\}\s*\{\s*\\?(?:mathrm\{)?d\}?\s*([a-z])\s*\^\s*\{?(\d+)\}?\s*\}\s*\((.+?)\)/g,
        (match, order1, variable, order2, expr) => `diff(${expr}, ${variable}, ${order1})`);

    // d/dx
    const derivRegex = /\\frac\s*\{\s*\\?(?:mathrm\{)?d\}?\s*\}\s*\{\s*\\?(?:mathrm\{)?d\}?\s*([a-z])\s*\}\s*/g;
    exprToEval = exprToEval.replace(new RegExp(derivRegex.source + '\\((.+?)\\)', 'g'), 'diff($2, $1)');

    // Recursive Parser for Containers (simplified for test)
    exprToEval = exprToEval.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)');
    exprToEval = exprToEval.replace(/\\sqrt\{([^}]+)\}/g, 'sqrt($1)');
    exprToEval = exprToEval.replace(/\^\{([^}]+)\}/g, '^($1)');

    // Implicit Multiplication
    exprToEval = exprToEval.replace(/(\d)(sqrt|sin|cos|tan|log|ln|arcsin|arccos|arctan)/g, '$1*$2');

    // Calculus/Algebra check
    const isCalculusOrAlgebra = /defint|integrate|diff|simplify|factor|solve|roots|sum/.test(exprToEval);

    if (exprToEval.includes('=') || isCalculusOrAlgebra) {
        try {
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
    // Quotient Rule / Complex Derivatives
    {
        name: "Quotient Rule (d/dx (x^2+1)/(x-1))",
        input: "\\frac{d}{dx}(\\frac{x^2+1}{x-1})",
        expected: "Should show derivative"
    },
    {
        name: "Chain Rule (d/dx sin(x^2))",
        input: "\\frac{d}{dx}(\\sin(x^2))",
        expected: "2*x*cos(x^2)"
    },
    {
        name: "Higher Order Derivative (d^2/dx^2 x^4)",
        input: "\\frac{d^2}{dx^2}(x^4)",
        expected: "12*x^2"
    },

    // Complex Integrals
    {
        name: "Integration by Parts (int x*e^x dx)",
        input: "\\int x*e^x dx",
        expected: "(x-1)*e^x"
    },
    {
        name: "Definite Integral (int_0^pi sin(x) dx)",
        input: "\\int_{0}^{\\pi} \\sin(x) dx",
        expected: "2"
    },

    // Long Algebra
    {
        name: "Expand Polynomial",
        input: "simplify((x+1)^5)",
        expected: "Expanded polynomial"
    },
    {
        name: "Factor Polynomial",
        input: "factor(x^4 - 16)",
        expected: "(x-2)*(x+2)*(x^2+4)"
    },
    {
        name: "Complex Simplify",
        input: "simplify(\\frac{x^2-1}{x-1} + \\frac{x^2+2x+1}{x+1})",
        expected: "2*x+2"
    },

    // Weird Powers/Roots
    {
        name: "Fractional Power",
        input: "simplify(x^{3/2} * x^{1/2})",
        expected: "x^2"
    },
    {
        name: "Nested Roots",
        input: "\\sqrt{16 + \\sqrt{16}}",
        expected: "4.472..."
    }
];

console.log("Running Stress Tests...");
tests.forEach(test => {
    const result = evaluate(test.input);
    console.log(`[${test.name}]`);
    console.log(`  Input: ${test.input}`);
    console.log(`  Result: ${result}`);
    console.log("---");
});
