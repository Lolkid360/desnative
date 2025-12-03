const latex = String.raw`\int_2^2x\,\mathrm{dx}`;
const latexBraced = String.raw`\int_{2}^{2}x\,\mathrm{dx}`;
const latexComplex = String.raw`\int_{0}^{\pi}sin(x)dx`;

function testRegex(str) {
    console.log(`Testing: ${str}`);

    // Modified regex: use [0-9a-zA-Z] (single char) for unbraced bounds
    const regex = /\\int(?:_\{([^}]+)\}|_([0-9a-zA-Z]))(?:\^\{([^}]+)\}|\^([0-9a-zA-Z]))\s*(.+?)\s*(?:\\,|\\:|\\;|\\s)*\\?(?:mathrm\{)?d\}?([a-z])/g;

    const result = str.replace(regex, (match, lower1, lower2, upper1, upper2, expr, variable) => {
        const lower = lower1 || lower2;
        const upper = upper1 || upper2;
        // Using the order: expr, lower, upper. And let's assume we might need variable?
        // Previous working code used: defint(expr, lower, upper)
        return `defint(${expr}, ${lower}, ${upper})`;
    });

    console.log(`Result: ${result}`);
}

testRegex(latex);
testRegex(latexBraced);
testRegex(latexComplex);
