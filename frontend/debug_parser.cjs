const { create, all } = require('mathjs');
const math = create(all);

// math.config({ number: 'Fraction' });

const evaluateExpression = (latex) => {
    console.log("Input:", latex);
    if (!latex || !latex.trim()) return null;

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

    console.log("After Basic Replacements:", exprToEval);

    // 2. Handle 'Ans'
    exprToEval = exprToEval.replace(/Ans/gi, `(0)`);

    // 3. Recursive Parser
    let loopCount = 0;
    const maxLoops = 100;

    const extractGroup = (str, openChar = '{', closeChar = '}') => {
        const startIndex = str.indexOf(openChar);
        if (startIndex === -1) return null;

        let balance = 0;
        let endIndex = -1;

        for (let i = startIndex; i < str.length; i++) {
            if (str[i] === openChar) {
                balance++;
            } else if (str[i] === closeChar) {
                balance--;
                if (balance === 0) {
                    endIndex = i;
                    break;
                }
            }
        }

        if (endIndex !== -1) {
            return {
                content: str.slice(startIndex + 1, endIndex),
                fullMatch: str.slice(startIndex, endIndex + 1)
            };
        }
        return null;
    };

    while (loopCount < maxLoops) {
        let changed = false;

        // Handle \frac
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

        // Handle \sqrt
        const sqrtIndex = exprToEval.indexOf('\\sqrt');
        if (!changed && sqrtIndex !== -1) {
            const afterSqrt = exprToEval.slice(sqrtIndex + 5);
            if (afterSqrt.trim().startsWith('[')) {
                const root = extractGroup(afterSqrt, '[', ']');
                if (root) {
                    const afterRoot = afterSqrt.slice(root.fullMatch.length);
                    const arg = extractGroup(afterRoot);
                    if (arg) {
                        const replacement = `nthRoot(${arg.content}, ${root.content})`;
                        exprToEval = exprToEval.slice(0, sqrtIndex) + replacement + afterRoot.slice(arg.fullMatch.length);
                        changed = true;
                    }
                }
            } else {
                const arg = extractGroup(afterSqrt);
                if (arg) {
                    const replacement = `sqrt(${arg.content})`;
                    exprToEval = exprToEval.slice(0, sqrtIndex) + replacement + afterSqrt.slice(arg.fullMatch.length);
                    changed = true;
                }
            }
        }

        // Handle ^{}
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

    console.log("After Recursive Parser:", exprToEval);

    // 4. Handle Implicit Multiplication
    exprToEval = exprToEval.replace(/(\d)(sqrt|sin|cos|tan|log|ln|arcsin|arccos|arctan|nthRoot)/g, '$1*$2');
    exprToEval = exprToEval.replace(/(\))(sqrt|sin|cos|tan|log|ln|arcsin|arccos|arctan|nthRoot)/g, '$1*$2');
    exprToEval = exprToEval.replace(/\)\(/g, ')*(');
    exprToEval = exprToEval.replace(/(\d)\(/g, '$1*(');
    exprToEval = exprToEval.replace(/\)(\d)/g, ')*$1');

    console.log("Final Expression:", exprToEval);

    try {
        const result = math.evaluate(exprToEval);
        console.log("Result:", result.toString());
        return result;
    } catch (error) {
        console.error("Evaluation Error:", error.message);
        return null;
    }
};

const input = String.raw`2\cdot\frac{-2\cdot2}{2\sqrt{8-2^2}}+\sqrt{8-2^2}`;
evaluateExpression(input);
