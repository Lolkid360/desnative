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

const solveAndDedupe = (latex) => {
    console.log(`\nInput: "${latex}"`);
    let exprToEval = latex;

    // Basic Replacements
    exprToEval = exprToEval
        .replace(/\\cdot/g, '*')
        .replace(/\\times/g, '*')
        .replace(/\\pi/g, 'pi')
        .replace(/π/g, 'pi')
        .replace(/\\left/g, '')
        .replace(/\\right/g, '')
        .replace(/\\frac(\d)(\d)/g, '($1)/($2)')
        .replace(/\\frac(\d)\{([^}]+)\}/g, '($1)/($2)')
        .replace(/\\frac\{([^}]+)\}(\d)/g, '($1)/($2)')
        .replace(/\\sqrt(\d)/g, 'sqrt($1)');

    // Recursive Parser (Simplified)
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
        const sqrtIndex = exprToEval.indexOf('\\sqrt');
        if (!changed && sqrtIndex !== -1) {
            const afterSqrt = exprToEval.slice(sqrtIndex + 5);
            const arg = extractGroup(afterSqrt);
            if (arg) {
                const replacement = `sqrt(${arg.content})`;
                exprToEval = exprToEval.slice(0, sqrtIndex) + replacement + afterSqrt.slice(arg.fullMatch.length);
                changed = true;
            }
        }
        if (!changed) break;
        loopCount++;
    }

    exprToEval = exprToEval.replace(/(\d)(sqrt|sin|cos|tan|log|ln|arcsin|arccos|arctan|nthRoot)/g, '$1*$2');
    exprToEval = exprToEval.replace(/(\))(sqrt|sin|cos|tan|log|ln|arcsin|arccos|arctan|nthRoot)/g, '$1*$2');
    exprToEval = exprToEval.replace(/\)\(/g, ')*(');
    exprToEval = exprToEval.replace(/(\d)\(/g, '$1*(');
    exprToEval = exprToEval.replace(/\)(\d)/g, ')*$1');
    exprToEval = exprToEval.replace(/(^|[^\d])\.(\d+)/g, '$10.$2');

    console.log(`Parsed: "${exprToEval}"`);

    try {
        const vars = nerdamer(exprToEval).variables();
        if (vars.length === 1) {
            const variable = vars[0];
            const solution = nerdamer.solve(exprToEval, variable);
            const solStr = solution.toString();
            console.log(`Raw Solution: ${solStr}`);

            const cleanSol = solStr.replace(/^\[|\]$/g, '');
            const parts = cleanSol.split(',');

            const formattedParts = parts.map(part => {
                try {
                    const num = math.evaluate(part);
                    return formatNumber(Number(num));
                } catch (e) {
                    return part;
                }
            });

            console.log(`Formatted Parts: ${formattedParts.join(', ')}`);

            // Deduplicate
            const uniqueParts = [...new Set(formattedParts)];
            console.log(`Unique Parts: ${uniqueParts.join(', ')}`);

            return uniqueParts.map(val => `${variable} = ${val}`).join(', ');
        }
    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
};

const input = String.raw`2\cdot\frac{-2\cdot2}{2\sqrt{8-2^2}}+\sqrt{8-x^2}=.2`;
const result = solveAndDedupe(input);
console.log(`Final Result: ${result}`);
