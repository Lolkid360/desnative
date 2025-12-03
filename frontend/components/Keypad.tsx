import React, { Suspense } from 'react';
import Button from './Button';
import { ButtonVariant, TabMode } from '../types';

// Lazy load the other layouts
const ABCLayout = React.lazy(() => import('./keypad/ABCLayout'));
const FuncLayout = React.lazy(() => import('./keypad/FuncLayout'));

interface KeypadProps {
    tab: TabMode;
    onCommand: (command: string, arg?: string) => void;
}

const Keypad: React.FC<KeypadProps> = ({ tab, onCommand }) => {

    // Helper for simple insert commands
    const ins = (val: string) => () => onCommand('insert', val);

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

    return (
        <div className="h-full w-full">
            {tab === 'MAIN' && renderMainLayout()}
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-sm text-gray-500">Loading...</div>}>
                {tab === 'ABC' && <ABCLayout onCommand={onCommand} />}
                {tab === 'FUNC' && <FuncLayout onCommand={onCommand} />}
            </Suspense>
        </div>
    );
};

export default Keypad;