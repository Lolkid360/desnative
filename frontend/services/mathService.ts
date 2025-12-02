import { create, all } from 'mathjs';
import { AngleMode } from '../types';

const math = create(all);

// Configure math.js
// Default configuration (number: 'number') is used to avoid type errors with mixed types (Fraction/BigNumber)
// and to ensure decimal output as requested by user.

export const evaluateExpression = (latex: string, angleMode: AngleMode, previousAnswer: string = "0"): string | null => {
    if (!latex || !latex.trim()) return null;

    let exprToEval = latex;

    // Check for variable substitution: "expression, var=value"
    // Regex: /^(.*),\s*([a-zA-Z])\s*=\s*(.+)$/
    // We handle this BEFORE other replacements to ensure we capture the structure
    const subMatch = latex.match(/^(.*),\s*([a-zA-Z])\s*=\s*(.+)$/);
    let subVar = "";
    let subVal: any = null;

    if (subMatch) {
        exprToEval = subMatch[1]; // The main expression part
        subVar = subMatch[2];     // The variable name
        const valExpr = subMatch[3]; // The value expression

        try {
            // Evaluate the value expression immediately
            // We need to process it a bit first (basic replacements) to ensure it evaluates
            let processedVal = valExpr
                .replace(/\\cdot/g, '*')
                .replace(/\\times/g, '*')
                .replace(/\\pi/g, 'pi')
                .replace(/π/g, 'pi');

            // Simple evaluation for the value
            subVal = math.evaluate(processedVal);
        } catch (e) {
            console.error("Error evaluating substitution value:", e);
            return null; // Fail if value is invalid
        }
    }

    // 1. Basic Replacements (Global)
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
        .replace(/\\left/g, '') // Remove \left
        .replace(/\\right/g, ''); // Remove \right

    // 2. Handle 'Ans'
    exprToEval = exprToEval.replace(/Ans/gi, `(${previousAnswer})`);

    // 3. Recursive Parser for Containers (\frac, \sqrt, ^{})
    let loopCount = 0;
    const maxLoops = 100; // Safety break

    while (loopCount < maxLoops) {
        let changed = false;

        // Handle \frac{num}{den}
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

        // Handle \sqrt[n]{x} or \sqrt{x}
        const sqrtIndex = exprToEval.indexOf('\\sqrt');
        if (!changed && sqrtIndex !== -1) {
            const afterSqrt = exprToEval.slice(sqrtIndex + 5);
            // Check for optional [n]
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

        // Handle ^{exp}
        const expIndex = exprToEval.indexOf('^{');
        if (!changed && expIndex !== -1) {
            const afterExp = exprToEval.slice(expIndex + 1); // start at {
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

    // 4. Handle Implicit Multiplication
    exprToEval = exprToEval.replace(/(\d)(sqrt|sin|cos|tan|log|ln|arcsin|arccos|arctan|nthRoot)/g, '$1*$2');
    exprToEval = exprToEval.replace(/(\))(sqrt|sin|cos|tan|log|ln|arcsin|arccos|arctan|nthRoot)/g, '$1*$2');
    exprToEval = exprToEval.replace(/\)\(/g, ')*(');
    exprToEval = exprToEval.replace(/(\d)\(/g, '$1*(');
    exprToEval = exprToEval.replace(/\)(\d)/g, ')*$1');

    // Define the scope
    const scope: any = {
        ln: math.log,
        log: math.log10,
        arcsin: (x: any) => applyInverseTrig(math.asin, x, angleMode),
        arccos: (x: any) => applyInverseTrig(math.acos, x, angleMode),
        arctan: (x: any) => applyInverseTrig(math.atan, x, angleMode),
    };

    // Add substituted variable to scope
    if (subVar && subVal !== null) {
        scope[subVar] = subVal;
    }

    // Trig overrides for Degree mode
    if (angleMode === 'DEG') {
        const trigFunctions = ['sin', 'cos', 'tan', 'sec', 'csc', 'cot'];
        trigFunctions.forEach(fn => {
            scope[fn] = (x: any) => {
                if (typeof x === 'number' || (x && x.type === 'BigNumber') || (x && x.type === 'Fraction')) {
                    return math[fn](math.unit(x, 'deg'));
                }
                return math[fn](x);
            };
        });
    }

    try {
        const result = math.evaluate(exprToEval, scope);

        // Filter out Functions
        if (typeof result === 'function') {
            return null;
        }

        // Handle undefined/null
        if (result === undefined || result === null) {
            return "";
        }

        // Format output
        if (typeof result === 'number') {
            return formatNumber(result);
        } else if (typeof result === 'object') {
            // Handle Units, Complex numbers, etc.
            if (result.type === 'Complex' || result.type === 'Unit' || result.type === 'Fraction') {
                return result.toString();
            }
            // Arrays/Matrices - try to format nicely or return string
            if (result.toString) {
                const str = result.toString();
                // Try to see if it converts to a simple number
                const num = Number(str);
                if (!isNaN(num)) {
                    return formatNumber(num);
                }
                return str;
            }
        }

        return result.toString();
    } catch (error) {
        console.error("Math evaluation error:", error);
        throw error;
    }
};

// Helper to extract a balanced group like { ... } or [ ... ]
const extractGroup = (str: string, openChar: string = '{', closeChar: string = '}'): { content: string, fullMatch: string } | null => {
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

const applyInverseTrig = (mathFn: Function, x: any, mode: AngleMode) => {
    const val = mathFn(x);
    if (mode === 'DEG' && typeof val === 'number') {
        return math.unit(val, 'rad').toNumber('deg');
    }
    return val;
};

const formatNumber = (num: number): string => {
    const precision = 5;
    // Check if it's an integer within epsilon
    if (Math.abs(num - Math.round(num)) < 1e-10) {
        return Math.round(num).toString();
    }
    // Remove trailing zeros
    return parseFloat(num.toFixed(precision)).toString();
};