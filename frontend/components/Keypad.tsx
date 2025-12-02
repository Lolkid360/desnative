import React from 'react';
import Button from './Button';
import Tooltip from './Tooltip';
import { ButtonVariant, TabMode } from '../types';

interface KeypadProps {
    tab: TabMode;
    onCommand: (command: string, arg?: string) => void;
}

const Keypad: React.FC<KeypadProps> = ({ tab, onCommand }) => {

    // Helper for simple insert commands
    const ins = (val: string) => () => onCommand('insert', val);
    // Helper for complex commands
    const cmd = (c: string) => () => onCommand(c);

    const renderMainLayout = () => (
        <div className="flex w-full h-full">
            {/* Left Function Panel - 3 cols */}
            <div className="w-[42%] p-1 grid grid-cols-3 grid-rows-4 gap-1 border-r" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-tertiary)' }}>
                <Button label="a²" onClick={ins('^2')} display={<>a<sup className="text-xs">2</sup></>} />
                <Button label="a^b" onClick={ins('^')} display={<>a<sup className="text-xs">b</sup></>} />
                <Button label="|a|" onClick={ins('|#@|')} />

                <Button label="sqrt" onClick={ins('\\sqrt')} display="√" />
                <Button label="root" onClick={ins('\\sqrt[#@]{}')} display={<span className="flex items-start"><sup className="text-[0.6em] pt-1">n</sup>√</span>} />
                <Button label="pi" onClick={ins('\\pi')} display="π" />

                <Button label="sin" onClick={ins('\\sin')} />
                <Button label="cos" onClick={ins('\\cos')} />
                <Button label="tan" onClick={ins('\\tan')} />

                <Button label="(" onClick={ins('(')} />
                <Button label=")" onClick={ins(')')} />
                <Button label="," onClick={ins(',')} />
            </div>

            {/* Right Numpad Panel - 4 cols */}
            <div className="w-[58%] p-1 grid grid-cols-4 grid-rows-4 gap-1" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <Button label="7" variant={ButtonVariant.DARK} onClick={ins('7')} />
                <Button label="8" variant={ButtonVariant.DARK} onClick={ins('8')} />
                <Button label="9" variant={ButtonVariant.DARK} onClick={ins('9')} />
                <Button label="/" variant={ButtonVariant.LIGHT} onClick={ins('\\frac{#@}{}')} display="÷" />

                <Button label="4" variant={ButtonVariant.DARK} onClick={ins('4')} />
                <Button label="5" variant={ButtonVariant.DARK} onClick={ins('5')} />
                <Button label="6" variant={ButtonVariant.DARK} onClick={ins('6')} />
                <Button label="*" variant={ButtonVariant.LIGHT} onClick={ins('*')} display="×" />

                <Button label="1" variant={ButtonVariant.DARK} onClick={ins('1')} />
                <Button label="2" variant={ButtonVariant.DARK} onClick={ins('2')} />
                <Button label="3" variant={ButtonVariant.DARK} onClick={ins('3')} />
                <Button label="-" variant={ButtonVariant.LIGHT} onClick={ins('-')} display="−" />

                <Button label="0" variant={ButtonVariant.DARK} onClick={ins('0')} />
                <Button label="." variant={ButtonVariant.DARK} onClick={ins('.')} />
                <Button label="ans" variant={ButtonVariant.LIGHT} onClick={ins('ans')} className="text-sm font-bold text-gray-500" />
                <Button label="+" variant={ButtonVariant.LIGHT} onClick={ins('+')} />
            </div>
        </div>
    );

    const renderABCLayout = () => (
        <div className="w-full h-full p-1 flex flex-col gap-1 justify-center" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            <div className="flex w-full justify-center gap-1">
                {['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'].map(k => (
                    <Button key={k} label={k} variant={ButtonVariant.DARK} onClick={ins(k)} className="w-[9%]" />
                ))}
            </div>
            <div className="flex w-full justify-center gap-1">
                {['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'].map(k => (
                    <Button key={k} label={k} variant={ButtonVariant.DARK} onClick={ins(k)} className="w-[9%]" />
                ))}
            </div>
            <div className="flex w-full justify-center gap-1">
                <div className="w-[9%]"></div>
                {['z', 'x', 'c', 'v', 'b', 'n', 'm'].map(k => (
                    <Button key={k} label={k} variant={ButtonVariant.DARK} onClick={ins(k)} className="w-[9%]" />
                ))}
                <div className="w-[9%]"></div>
            </div>
        </div>
    );

    const renderFuncLayout = () => (
        <div className="w-full h-full overflow-y-auto p-1 display-scrollbar" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            <div className="grid grid-cols-4 gap-1 pb-1">
                {/* Calculus */}
                <Tooltip title="Integral" description="Indefinite integral" example="∫ x^2 dx">
                    <Button label="∫" onClick={ins('\\int')} className="font-serif italic" />
                </Tooltip>
                <Tooltip title="Definite Integral" description="Integral with bounds" example="∫₀² x^2 dx">
                    <Button label="∫a^b" onClick={ins('\\int_{}^{}')} className="text-xs" />
                </Tooltip>
                <Tooltip title="Derivative" description="Derivative with respect to x" example="d/dx (x^2)">
                    <Button label="d/dx" onClick={ins('\\frac{d}{dx}')} className="text-xs" />
                </Tooltip>
                <Tooltip title="Summation" description="Sum notation" example="Σ (n=1 to 10) n">
                    <Button label="sum" onClick={ins('\\sum')} className="text-xs" />
                </Tooltip>

                {/* Algebra */}
                <Tooltip title="Simplify" description="Simplify algebraic expression" example="simplify(x^2 + 2*x + 1)">
                    <Button label="simp" onClick={ins('simplify(')} className="text-xs" title="Simplify" />
                </Tooltip>
                <Tooltip title="Factor" description="Factor algebraic expression" example="factor(x^2 - 4)">
                    <Button label="fact" onClick={ins('factor(')} className="text-xs" title="Factor" />
                </Tooltip>
                <Tooltip title="Solve" description="Solve equation for variable" example="x^2 - 4 = 0">
                    <Button label="solve" onClick={ins('solve(')} className="text-xs" />
                </Tooltip>
                <Tooltip title="Roots" description="Find polynomial roots" example="roots(x^2 + 3*x + 2)">
                    <Button label="root" onClick={ins('roots(')} className="text-xs" />
                </Tooltip>

                {/* Trig */}
                <Tooltip title="Sine" description="Sine function" example="sin(45)">
                    <Button label="sin" onClick={ins('\\sin')} />
                </Tooltip>
                <Tooltip title="Cosine" description="Cosine function" example="cos(60)">
                    <Button label="cos" onClick={ins('\\cos')} />
                </Tooltip>
                <Tooltip title="Tangent" description="Tangent function" example="tan(30)">
                    <Button label="tan" onClick={ins('\\tan')} />
                </Tooltip>
                <Tooltip title="Arcsine" description="Inverse sine (sin⁻¹)" example="arcsin(0.5)">
                    <Button label="asin" onClick={ins('\\arcsin')} display={<>sin<sup className="text-xs">-1</sup></>} />
                </Tooltip>

                <Tooltip title="Arccosine" description="Inverse cosine (cos⁻¹)" example="arccos(0.5)">
                    <Button label="acos" onClick={ins('\\arccos')} display={<>cos<sup className="text-xs">-1</sup></>} />
                </Tooltip>
                <Tooltip title="Arctangent" description="Inverse tangent (tan⁻¹)" example="arctan(1)">
                    <Button label="atan" onClick={ins('\\arctan')} display={<>tan<sup className="text-xs">-1</sup></>} />
                </Tooltip>
                <Tooltip title="Mean" description="Average of values" example="mean(1, 2, 3, 4, 5)">
                    <Button label="mean" onClick={ins('mean(')} />
                </Tooltip>
                <Tooltip title="Standard Deviation" description="Population standard deviation" example="std(1, 2, 3, 4, 5)">
                    <Button label="stdev" onClick={ins('std(')} />
                </Tooltip>

                <Tooltip title="Permutation" description="Number of ordered arrangements" example="5 nPr 3 = 60">
                    <Button label="nPr" onClick={ins('nPr')} />
                </Tooltip>
                <Tooltip title="Combination" description="Number of unordered selections" example="5 nCr 3 = 10">
                    <Button label="nCr" onClick={ins('nCr')} />
                </Tooltip>
                <Tooltip title="Factorial" description="Product of all positive integers ≤ n" example="5! = 120">
                    <Button label="!" onClick={ins('!')} />
                </Tooltip>
                <Tooltip title="Logarithm" description="Base-10 logarithm" example="log(100) = 2">
                    <Button label="log" onClick={ins('\\log')} />
                </Tooltip>

                <Tooltip title="Natural Logarithm" description="Base-e logarithm (ln)" example="ln(e) = 1">
                    <Button label="ln" onClick={ins('\\ln')} />
                </Tooltip>
                <Tooltip title="Euler's Number" description="Mathematical constant e ≈ 2.718" example="e^1 = 2.718">
                    <Button label="e" onClick={ins('e')} />
                </Tooltip>
                <Tooltip title="Minimum" description="Smallest value from a list" example="min(3, 1, 4, 2)">
                    <Button label="min" onClick={ins('min(')} />
                </Tooltip>
                <Tooltip title="Maximum" description="Largest value from a list" example="max(3, 1, 4, 2)">
                    <Button label="max" onClick={ins('max(')} />
                </Tooltip>
            </div>
        </div>
    );


    return (
        <div className="h-full w-full">
            {tab === 'MAIN' && renderMainLayout()}
            {tab === 'ABC' && renderABCLayout()}
            {tab === 'FUNC' && renderFuncLayout()}
        </div>
    );
};

export default Keypad;