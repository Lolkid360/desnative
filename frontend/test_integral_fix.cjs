const nerdamer = require('nerdamer');
require('nerdamer/Algebra');
require('nerdamer/Calculus');
require('nerdamer/Solve');

function testIntegral(latex) {
    console.log(`\nInput: "${latex}"`);
    let exprToEval = latex;

    // Definite Integral: \int_{a}^{b} f(x) dx (or without dx)
    exprToEval = exprToEval.replace(/\\int(?:_\{([^}]+)\}|_([0-9a-zA-Z]))(?:\^\{([^}]+)\}|\^([0-9a-zA-Z]))\s*(.+?)\s*(?:\\,|\\:|\\;|\\s)*\\?(?:mathrm\{)?d\}?([a-z])\}?/g,
        (match, l1, l2, u1, u2, expr, variable) => {
            return `defint(${expr}, ${l1 || l2}, ${u1 || u2})`;
        });

    exprToEval = exprToEval.replace(/\\int(?:_\{([^}]+)\}|_([0-9a-zA-Z]))(?:\^\{([^}]+)\}|\^([0-9a-zA-Z]))\s*(.+?)(?=\s*$|\s*[+\-*/^)])/g,
        (match, l1, l2, u1, u2, expr) => {
            return `defint(${expr}, ${l1 || l2}, ${u1 || u2})`;
        });

    // Indefinite Integral: \int f(x) dx (or without dx)  
    // First try with explicit dx
    exprToEval = exprToEval.replace(/\\int\s*(.+?)\s*(?:\\,|\\:|\\;|\\s)*\\?(?:mathrm\{)?d\}?([a-z])\}?/g, 'integrate($1, $2)');

    // Current line 156: \int\s+
    // exprToEval = exprToEval.replace(/\\int\s+(.+?)(?=\s*$|\s*[+\-*/^)\|])/g, 'integrate($1, x)');

    // Proposed fix: \int\s*
    exprToEval = exprToEval.replace(/\\int\s*(.+?)(?=\s*$|\s*[+\-*/^)\|])/g, 'integrate($1, x)');

    console.log(`Parsed: "${exprToEval}"`);
    try {
        if (/integrate/.test(exprToEval)) {
            const result = nerdamer(exprToEval).evaluate().toTeX();
            console.log(`Result (LaTeX): ${result}`);
        }
    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
}

testIntegral(String.raw`\int3x`);
testIntegral(String.raw`\int 3x`);
testIntegral(String.raw`\int x^2+1`);
