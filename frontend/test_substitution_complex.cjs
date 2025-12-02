const nerdamer = require('nerdamer');
const { create, all } = require('mathjs');
const math = create(all);

// Mock the parsing logic from mathService.ts
const parseAndSolve = (latex) => {
    console.log(`\nInput: "${latex}"`);

    // Check for variable substitution
    const subMatch = latex.match(/^(.*),\s*([a-zA-Z])\s*=\s*(.+)$/);
    let exprToEval = latex;
    let subVar = "";
    let subVal = null;

    if (subMatch) {
        exprToEval = subMatch[1];
        subVar = subMatch[2];
        const valExpr = subMatch[3];
        console.log(`Substitution: ${subVar} = ${valExpr}`);
        try {
            subVal = math.evaluate(valExpr);
            console.log(`Resolved value: ${subVal}`);
        } catch (e) {
            console.log("Error resolving value:", e.message);
        }
    }

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

    // Recursive Parser Logic (Simplified for test)
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
            const arg = extractGroup(afterSqrt);
            if (arg) {
                const replacement = `sqrt(${arg.content})`;
                exprToEval = exprToEval.slice(0, sqrtIndex) + replacement + afterSqrt.slice(arg.fullMatch.length);
                changed = true;
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

    // Implicit Multiplication
    exprToEval = exprToEval.replace(/(\d)(sqrt|sin|cos|tan|log|ln|arcsin|arccos|arctan|nthRoot)/g, '$1*$2');
    exprToEval = exprToEval.replace(/(\))(sqrt|sin|cos|tan|log|ln|arcsin|arccos|arctan|nthRoot)/g, '$1*$2');
    exprToEval = exprToEval.replace(/\)\(/g, ')*(');
    exprToEval = exprToEval.replace(/(\d)\(/g, '$1*(');
    exprToEval = exprToEval.replace(/\)(\d)/g, ')*$1');

    // Fix decimals
    exprToEval = exprToEval.replace(/(^|[^\d])\.(\d+)/g, '$10.$2');

    console.log(`Parsed Expression: "${exprToEval}"`);

    const scope = {};
    if (subVar && subVal !== null) {
        scope[subVar] = subVal;
    }

    try {
        const result = math.evaluate(exprToEval, scope);
        console.log(`Result: ${result}`);
    } catch (e) {
        console.log(`Error evaluating: ${e.message}`);
    }
};

// Test with normalized braces because math-field likely outputs them
const inputNormalized = String.raw`\left(\frac{2}{5}\cdot-\frac{4}{5}\cdot\left(x\right)^{-\frac{9}{5}}\right),x=2`;
parseAndSolve(inputNormalized);

// Test with raw input just in case
const inputRaw = String.raw`\left(\frac25\cdot-\frac45\cdot\left(x\right)^{-\frac95}\right),x=2`;
parseAndSolve(inputRaw);
