const nerdamer = require('nerdamer');
require('nerdamer/Algebra');
require('nerdamer/Calculus');
require('nerdamer/Solve');

const testCalculus = (latex) => {
    console.log(`\nInput: "${latex}"`);
    let exprToEval = latex;

    // Basic Replacements (from mathService.ts)
    exprToEval = exprToEval
        .replace(/\\cdot/g, '*')
        .replace(/\\times/g, '*')
        .replace(/\\left/g, '')
        .replace(/\\right/g, '');

    // Calculus Regexes (from mathService.ts)

    // Definite Integral: \int_{a}^{b} f(x) dx
    exprToEval = exprToEval.replace(/\\int_\{([^}]+)\}\^\{([^}]+)\}\s*(.+?)\s*d([a-z])/g, 'defint($3, $1, $2)');

    // Indefinite Integral: \int f(x) dx
    exprToEval = exprToEval.replace(/\\int\s*(.+?)\s*d([a-z])/g, 'integrate($1)');

    // Derivative: \frac{d}{dx} f(x) or \frac{d}{dx}(f(x))
    exprToEval = exprToEval.replace(/\\frac\{d\}\{d([a-z])\}\s*\((.+?)\)/g, 'diff($2, $1)'); // with parens
    exprToEval = exprToEval.replace(/\\frac\{d\}\{d([a-z])\}\s*(.+)/g, 'diff($2, $1)'); // without parens (greedy)

    console.log(`Parsed: "${exprToEval}"`);

    try {
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

// Test Cases from User Report
testCalculus(String.raw`\frac{d}{dx}x`); // Derivative of x -> should be 1
testCalculus(String.raw`\frac{d}{dx}(x)`); // Derivative of (x) -> should be 1
testCalculus(String.raw`\int x dx`); // Integral of x -> x^2/2
testCalculus(String.raw`\int 1 dx`); // Integral of 1 -> x

// Potential edge cases
testCalculus(String.raw`\frac{d}{dx} x`); // Space after dx
testCalculus(String.raw`\int xdx`); // No space
