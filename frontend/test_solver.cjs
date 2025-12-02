const nerdamer = require('nerdamer');
require('nerdamer/Algebra');
require('nerdamer/Calculus');
require('nerdamer/Solve');

const solveEquation = (equation, subVar, subVal) => {
    console.log(`\nTesting: "${equation}"` + (subVar ? `, ${subVar}=${subVal}` : ''));

    let exprToSolve = equation;

    // Simulate substitution
    if (subVar && subVal !== undefined) {
        // Simple string replacement for testing, actual app uses math.js scope or similar
        // But for nerdamer, we might need to substitute explicitly if passing to it
        // Or we can evaluate the side with the variable first?

        // Actually, the app logic is:
        // 1. Extract substitution
        // 2. Evaluate substitution value
        // 3. Add to scope? 
        // But nerdamer doesn't use math.js scope directly.

        // If we have (y=2x), x=5
        // We want to solve y=2*5 -> y=10.

        // Nerdamer has .sub()
        exprToSolve = nerdamer(exprToSolve).sub(subVar, subVal).toString();
        console.log(`  After substitution: ${exprToSolve}`);
    }

    // Check for equals
    if (exprToSolve.indexOf('=') !== -1) {
        try {
            // Find variables
            const vars = nerdamer(exprToSolve).variables();
            console.log(`  Variables: ${vars}`);

            if (vars.length === 1) {
                const variable = vars[0];
                const solution = nerdamer.solve(exprToSolve, variable);
                console.log(`  Solution for ${variable}: ${solution.toString()}`);

                // Format decimal
                const decimal = nerdamer(solution.toString()).text('decimals');
                console.log(`  Decimal: ${decimal}`);
            } else if (vars.length === 0) {
                // Check truthiness? e.g. 10=10
                const bool = nerdamer(exprToSolve).evaluate().text();
                console.log(`  Evaluation: ${bool}`);
            } else {
                console.log(`  Error: Too many variables (${vars.length})`);
            }
        } catch (e) {
            console.log(`  Error solving: ${e.message}`);
        }
    } else {
        console.log("  Not an equation.");
    }
};

// Test cases
solveEquation("2*x=10");
solveEquation("4545*x=3");
solveEquation("y=2*x", "x", "5");
solveEquation("x^2=4");
solveEquation("x+5=2");
