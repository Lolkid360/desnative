const latex1 = String.raw`\int_2^2x\,\mathrm{dx}`; // User reported failing
const latex2 = String.raw`\int_2^2x\,\mathrm{d}x`; // Standard
const latex3 = String.raw`\int_2^2x\,dx`;         // Simple

function testRegex(str) {
    console.log(`Testing: ${str}`);

    // Current regex
    // const regex = /\\int(?:_\{([^}]+)\}|_([0-9a-zA-Z]))(?:\^\{([^}]+)\}|\^([0-9a-zA-Z]))\s*(.+?)\s*(?:\\,|\\:|\\;|\\s)*\\?(?:mathrm\{)?d\}?([a-z])/g;

    // Proposed fix: Add \}? at the end to catch trailing brace from \mathrm{dx}
    const regex = /\\int(?:_\{([^}]+)\}|_([0-9a-zA-Z]))(?:\^\{([^}]+)\}|\^([0-9a-zA-Z]))\s*(.+?)\s*(?:\\,|\\:|\\;|\\s)*\\?(?:mathrm\{)?d\}?([a-z])\}?/g;

    const result = str.replace(regex, (match, l1, l2, u1, u2, expr, variable) => {
        const lower = l1 || l2;
        const upper = u1 || u2;
        return `defint(${expr}, ${lower}, ${upper})`;
    });

    console.log(`Result: ${result}`);
}

testRegex(latex1);
testRegex(latex2);
testRegex(latex3);
