import React from 'react';
import Button from './Button';
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
                <Button label="∫" onClick={ins('\\int')} className="font-serif italic" />
                <Button label="∫a^b" onClick={ins('\\int_{}^{}')} className="text-xs" />
                <Button label="d/dx" onClick={ins('\\frac{d}{dx}')} className="text-xs" />
                <Button label="sum" onClick={ins('\\sum')} className="text-xs" />

                {/* Algebra */}
                <Button label="simp" onClick={ins('simplify(')} className="text-xs" title="Simplify" />
                <Button label="fact" onClick={ins('factor(')} className="text-xs" title="Factor" />
                <Button label="solve" onClick={ins('solve(')} className="text-xs" />
                <Button label="root" onClick={ins('roots(')} className="text-xs" />

                {/* Trig */}
                <Button label="sin" onClick={ins('\\sin')} />
                <Button label="cos" onClick={ins('\\cos')} />
                <Button label="tan" onClick={ins('\\tan')} />
                <Button label="asin" onClick={ins('\\arcsin')} display={<>sin<sup className="text-xs">-1</sup></>} />

                <Button label="acos" onClick={ins('\\arccos')} display={<>cos<sup className="text-xs">-1</sup></>} />
                <Button label="atan" onClick={ins('\\arctan')} display={<>tan<sup className="text-xs">-1</sup></>} />
                <Button label="mean" onClick={ins('mean(')} />
                <Button label="stdev" onClick={ins('std(')} />

                <Button label="nPr" onClick={ins('nPr')} />
                <Button label="nCr" onClick={ins('nCr')} />
                <Button label="!" onClick={ins('!')} />
                <Button label="log" onClick={ins('\\log')} />

                <Button label="ln" onClick={ins('\\ln')} />
                <Button label="e" onClick={ins('e')} />
                <Button label="min" onClick={ins('min(')} />
                <Button label="max" onClick={ins('max(')} />
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