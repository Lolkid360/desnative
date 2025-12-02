const nerdamer = require('nerdamer');
require('nerdamer/Algebra');
require('nerdamer/Calculus');
require('nerdamer/Solve');

// Mock the parsing logic from mathService.ts
const parseAndSolve = (latex) => {
    console.log(`\nInput: "${latex}"`);
    let exprToEval = latex;

    // 1. Basic Replacements
    exprToEval = exprToEval
        .replace(/\\cdot/g, '*')
        .replace(/\\times/g, '*')
        .replace(/\\pi/g, 'pi')
        .replace(/π/g, 'pi')
        .replace(/\\sin/g, 'sin')
        .replace(/\\cos/g, 'cos')
        .replace(/\\tan/g, 'tan')
        .replace(/\\arcsin/g, 'arcsin')
        .replace(/\\arccos/g, 'arccos')
        .replace(/\\arctan/g, 'arctan')
        .replace(/\\log/g, 'log')
        .replace(/\\ln/g, 'ln')
        .replace(/\\left/g, '')
        .replace(/\\right/g, '');

    // 3. Recursive Parser (Simplified for this test, assuming extractGroup works)
    // We'll just use a simplified version or copy the logic if needed.
    // For the specific input: 2\cdot\frac{-2\cdot2}{2\sqrt{8-2^2}}+\sqrt{8-x^2}=.2

    // Let's implement the recursive parser logic to be sure
    const extractGroup = (str, openChar = '{', closeChar = '}') => {
        const startIndex = str.indexOf(openChar);
        if (startIndex === -1) return null;
        let balance = 0;
        let endIndex = -1;
        for (let i = startIndex; i < str.length; i++) {
            if (str[i] === openChar) balance++;
            else if (str[i] === closeChar) {
                balance--;
                if (balance === 0) {
                    endIndex = i;
                    break;
                }
            }
        }
        if (endIndex !== -1) return { content: str.slice(startIndex + 1, endIndex), fullMatch: str.slice(startIndex, endIndex + 1) };
        return null;
    };

    let loopCount = 0;
    while (loopCount < 100) {
        let changed = false;
        // \frac
        const fracIndex = exprToEval.indexOf('\\frac');
        if (fracIndex !== -1) {
            const afterFrac = exprToEval.slice(fracIndex + 5);
            const num = extractGroup(afterFrac);
            if (num) {
                const afterNum = afterFrac.slice(num.fullMatch.length);
                const den = extractGroup(afterNum);
                if (den) {
                    const replacement = `(${num.content})/(${den.content})`;
                    exprToEval = exprToEval.slice(0, fracIndex) + replacement + afterNum.slice(den.fullMatch.length);
                    changed = true;
                }
            }
        }
        // \sqrt
        const sqrtIndex = exprToEval.indexOf('\\sqrt');
        if (!changed && sqrtIndex !== -1) {
            const afterSqrt = exprToEval.slice(sqrtIndex + 5);
            if (afterSqrt.trim().startsWith('[')) {
                // nth root logic omitted for brevity if not needed for this case
            } else {
                const arg = extractGroup(afterSqrt);
                if (arg) {
                    const replacement = `sqrt(${arg.content})`;
                    exprToEval = exprToEval.slice(0, sqrtIndex) + replacement + afterSqrt.slice(arg.fullMatch.length);
                    changed = true;
                }
            }
        }
        // ^{}
        const expIndex = exprToEval.indexOf('^{');
        if (!changed && expIndex !== -1) {
            const afterExp = exprToEval.slice(expIndex + 1);
            const arg = extractGroup(afterExp);
            if (arg) {
                const replacement = `^(${arg.content})`;
                exprToEval = exprToEval.slice(0, expIndex) + replacement + afterExp.slice(arg.fullMatch.length);
                changed = true;
            }
        }
        if (!changed) break;
        loopCount++;
    }

    // 4. Implicit Multiplication
    exprToEval = exprToEval.replace(/(\d)(sqrt|sin|cos|tan|log|ln|arcsin|arccos|arctan|nthRoot)/g, '$1*$2');
    exprToEval = exprToEval.replace(/(\))(sqrt|sin|cos|tan|log|ln|arcsin|arccos|arctan|nthRoot)/g, '$1*$2');
    exprToEval = exprToEval.replace(/\)\(/g, ')*(');
    exprToEval = exprToEval.replace(/(\d)\(/g, '$1*(');
    exprToEval = exprToEval.replace(/\)(\d)/g, ')*$1');

    // Fix decimals starting with dot (e.g. .2 -> 0.2)
    exprToEval = exprToEval.replace(/(^|[^\d])\.(\d+)/g, '$10.$2');

    console.log(`Parsed Expression: "${exprToEval}"`);

    // Solve
    try {
        const vars = nerdamer(exprToEval).variables();
        console.log(`Variables: ${vars}`);

        if (vars.length === 1) {
            const variable = vars[0];
            const solution = nerdamer.solve(exprToEval, variable);
            console.log(`Solution: ${solution.toString()}`);

            // Try to evaluate solution to decimal
            // nerdamer solution might be symbolic
        } else {
            console.log("Not 1 variable.");
        }
    } catch (e) {
        console.log(`Error solving: ${e.message}`);
    }
};

const input = String.raw`2\cdot\frac{-2\cdot2}{2\sqrt{8-2^2}}+\sqrt{8-x^2}=.2`;
parseAndSolve(input);
