const nerdamer = require('nerdamer');
require('nerdamer/Algebra');
require('nerdamer/Calculus');
require('nerdamer/Solve');
const { create, all } = require('mathjs');
const math = create(all);

const formatNumber = (num) => {
    const precision = 5;
    if (Math.abs(num - Math.round(num)) < 1e-10) {
        return Math.round(num).toString();
    }
    return parseFloat(num.toFixed(precision)).toString();
};

const testOutput = (expr) => {
    console.log(`\nExpression: "${expr}"`);
    try {
        const result = nerdamer(expr);
        const text = result.text();
        console.log(`Text: ${text}`);

        // Try to evaluate to number
        try {
            const num = math.evaluate(text);
            if (typeof num === 'number' && !isNaN(num)) {
                console.log(`Numeric: ${formatNumber(num)}`);
                return;
            }
        } catch (e) {
            // Not a number
        }

        // If not number, get LaTeX
        const latex = result.toTeX();
        console.log(`LaTeX: ${latex}`);

    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
};

// Test Cases
testOutput('diff(x^2, x)'); // Symbolic -> 2x
testOutput('integrate(x)'); // Symbolic -> 0.5 x^2 -> \frac{1}{2} x^{2}
testOutput('defint(x, 0, 1)'); // Numeric -> 0.5
testOutput('simplify(x/x)'); // Numeric -> 1
testOutput('factor(x^2 - 4)'); // Symbolic -> (x-2)(x+2)
