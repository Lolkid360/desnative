const nerdamer = require('nerdamer');
require('nerdamer/Algebra');
require('nerdamer/Calculus');
require('nerdamer/Solve');

function testIntegral(latex) {
    console.log(`\nInput: "${latex}"`);
    let exprToEval = latex;

    // Definite Integral with dx
    exprToEval = exprToEval.replace(/\\int(?:_\{([^}]+)\}|_([0-9a-zA-Z]))(?:\^\{([^}]+)\}|\^([0-9a-zA-Z]))\s*(.+?)\s*(?:\\,|\\:|\\;|\\s)*\\?(?:mathrm\{)?d\}?([a-z])\}?/g,
        (match, l1, l2, u1, u2, expr, variable) => {
            return `defint(${expr}, ${l1 || l2}, ${u1 || u2})`;
        });

    // Definite Integral WITHOUT dx
    exprToEval = exprToEval.replace(/\\int(?:_\{([^}]+)\}|_([0-9a-zA-Z]))(?:\^\{([^}]+)\}|\^([0-9a-zA-Z]))\s*(.+?)(?=\s*$|\s*[)\|]|\s*\\int)/g,
        (match, l1, l2, u1, u2, expr) => {
            return `defint(${expr}, ${l1 || l2}, ${u1 || u2})`;
        });

    // Indefinite Integral with dx
    exprToEval = exprToEval.replace(/\\int\s*(.+?)\s*(?:\\,|\\:|\\;|\\s)*\\?(?:mathrm\{)?d\}?([a-z])\}?/g, 'integrate($1, $2)');

    // Indefinite Integral WITHOUT dx
    exprToEval = exprToEval.replace(/\\int\s*(.+?)(?=\s*$|\s*[)\|]|\s*\\int)/g, 'integrate($1, x)');

    console.log(`Parsed: "${exprToEval}"`);
}

testIntegral(String.raw`\int 3x + \int 4x`);
testIntegral(String.raw`\int 3x + 5`);
testIntegral(String.raw`\int3x`);
