const latex = String.raw`\int_2^2x\,\mathrm{dx}`;
const latexBraced = String.raw`\int_{2}^{2}x\,\mathrm{dx}`;

// Current regex
// exprToEval = exprToEval.replace(/\\int_\{([^}]+)\}\^\{([^}]+)\}\s*(.+?)\s*(?:\\,|\\:|\\;|\\s)*\\?(?:mathrm\{)?d\}?([a-z])/g, 'defint($3, $1, $2)');

function testRegex(str) {
    console.log(`Testing: ${str}`);

    // Improved regex to handle optional braces
    // _\{([^}]+)\}  matches _{...}
    // _(\d)         matches _d
    // We need to match either.

    // Let's construct a regex that handles both.
    // Bounds part: (?:_\{([^}]+)\}|_(\d+))
    // But capturing groups indices will shift.

    // Let's try to normalize the input first? No, better to have a robust regex.

    // Regex for lower bound: (?:_\{([^}]+)\}|_([0-9a-zA-Z]+))
    // Regex for upper bound: (?:\^\{([^}]+)\}|\^([0-9a-zA-Z]+))

    const regex = /\\int(?:_\{([^}]+)\}|_([0-9a-zA-Z]+))(?:\^\{([^}]+)\}|\^([0-9a-zA-Z]+))\s*(.+?)\s*(?:\\,|\\:|\\;|\\s)*\\?(?:mathrm\{)?d\}?([a-z])/g;

    const result = str.replace(regex, (match, lower1, lower2, upper1, upper2, expr, variable) => {
        const lower = lower1 || lower2;
        const upper = upper1 || upper2;
        return `defint(${expr}, ${lower}, ${upper}, ${variable})`;
    });

    console.log(`Result: ${result}`);
}

testRegex(latex);
testRegex(latexBraced);
