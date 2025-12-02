const nerdamer = require('nerdamer');
require('nerdamer/Algebra');
require('nerdamer/Calculus');
require('nerdamer/Solve');

const testCalculus = (latex) => {
    console.log(`\nInput: "${latex}"`);
    let exprToEval = latex;

    // Basic Replacements
    exprToEval = exprToEval
        .replace(/\\cdot/g, '*')
        .replace(/\\left/g, '')
        .replace(/\\right/g, '');

    // Calculus Parsing Logic (Mirroring mathService.ts)

    // Definite Integral: \int_{a}^{b} f(x) dx
    // Regex: \\int_\{([^}]+)\}\^\{([^}]+)\}\s*(.+?)\s*dx
    // We need to handle potential lack of space or different d char
    exprToEval = exprToEval.replace(/\\int_\{([^}]+)\}\^\{([^}]+)\}\s*(.+?)\s*d([a-z])/g, 'defint($3, $1, $2)');

    // Indefinite Integral: \int f(x) dx
    exprToEval = exprToEval.replace(/\\int\s*(.+?)\s*d([a-z])/g, 'integrate($1)');

    // Derivative: \frac{d}{dx} f(x)
    // MathLive might output \frac{d}{dx}f(x) or \frac{d}{dx}(f(x))
    exprToEval = exprToEval.replace(/\\frac\{d\}\{d([a-z])\}\s*\((.+?)\)/g, 'diff($2, $1)'); // with parens
    exprToEval = exprToEval.replace(/\\frac\{d\}\{d([a-z])\}\s*(.+)/g, 'diff($2, $1)'); // without parens

    console.log(`Parsed: "${exprToEval}"`);

    try {
        // Check if it's a calculus function
        if (/defint|integrate|diff/.test(exprToEval)) {
            const result = nerdamer(exprToEval).evaluate().text();
            console.log(`Result: ${result}`);
        } else {
            console.log("Not recognized as calculus.");
        }
    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
};

// Test Cases
testCalculus(String.raw`\int_{0}^{1} x dx`); // Standard
testCalculus(String.raw`\int x dx`); // Indefinite
testCalculus(String.raw`\frac{d}{dx}(x^2)`); // Derivative with parens
testCalculus(String.raw`\frac{d}{dx}x^2`); // Derivative without parens
testCalculus(String.raw`\int_{0}^{1}x dx`); // Tight spacing
