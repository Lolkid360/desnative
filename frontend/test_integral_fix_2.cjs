const nerdamer = require('nerdamer');
require('nerdamer/Algebra');
require('nerdamer/Calculus');
require('nerdamer/Solve');

function testIntegral(latex) {
    console.log(`\nInput: "${latex}"`);
    let exprToEval = latex;

    // 1. Definite Integral with dx
    exprToEval = exprToEval.replace(/\\int(?:_\{([^}]+)\}|_([0-9a-zA-Z]))(?:\^\{([^}]+)\}|\^([0-9a-zA-Z]))\s*(.+?)\s*(?:\\,|\\:|\\;|\\s)*\\?(?:mathrm\{)?d\}?([a-z])\}?/g,
        (match, l1, l2, u1, u2, expr, variable) => {
            return `defint(${expr}, ${l1 || l2}, ${u1 || u2})`;
        });

    // 2. Definite Integral WITHOUT dx
    // Fixing lookahead: removed [+\-*/^]
    exprToEval = exprToEval.replace(/\\int(?:_\{([^}]+)\}|_([0-9a-zA-Z]))(?:\^\{([^}]+)\}|\^([0-9a-zA-Z]))\s*(.+?)(?=\s*$|\s*[)\|])/g,
        (match, l1, l2, u1, u2, expr) => {
            return `defint(${expr}, ${l1 || l2}, ${u1 || u2})`;
        });

    // 3. Indefinite Integral with dx
    exprToEval = exprToEval.replace(/\\int\s*(.+?)\s*(?:\\,|\\:|\\;|\\s)*\\?(?:mathrm\{)?d\}?([a-z])\}?/g, 'integrate($1, $2)');

    // 4. Indefinite Integral WITHOUT dx
    // Proposed fix: \int\s* (allow no space) and removed [+\-*/^] from lookahead
    exprToEval = exprToEval.replace(/\\int\s*(.+?)(?=\s*$|\s*[)\|])/g, 'integrate($1, x)');

    console.log(`Parsed: "${exprToEval}"`);
    try {
        if (/integrate|defint/.test(exprToEval)) {
            const result = nerdamer(exprToEval).evaluate().toTeX();
            console.log(`Result (LaTeX): ${result}`);
        }
    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
}

console.log("--- Testing \int3x fix ---");
testIntegral(String.raw`\int3x`);
testIntegral(String.raw`\int 3x`);

console.log("\n--- Testing exponent/operator fix ---");
testIntegral(String.raw`\int x^2+1`);
testIntegral(String.raw`\int_{0}^{1} x^2+1`);

console.log("\n--- Testing nested/bounded fix ---");
testIntegral(String.raw`(\int 3x) + 5`);
testIntegral(String.raw`\int 3x | _{x=1}`); // Integration then evaluation (not a standard notation but let's see)
