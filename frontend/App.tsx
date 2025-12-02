import React, { useState, useEffect, useRef } from 'react';
import Display from './components/Display';
import Keypad from './components/Keypad';
import Button from './components/Button';
import { AngleMode, TabMode, HistoryItem, ButtonVariant } from './types';
import { evaluateExpression } from './services/mathService';
import { RotateCcw, ArrowLeft, Sun, Moon, Monitor } from 'lucide-react';
import TitleBar from './components/TitleBar';
import { useTheme } from './contexts/ThemeContext';

const App: React.FC = () => {
    const { theme, setTheme } = useTheme();

    // expression stores the LaTeX string for History display and logic
    const [expression, setExpression] = useState<string>("");
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [angleMode, setAngleMode] = useState<AngleMode>('DEG');
    const [tabMode, setTabMode] = useState<TabMode>('MAIN');
    const [liveResult, setLiveResult] = useState<string | null>(null);

    // Ref to the custom web component
    const mathFieldRef = useRef<any>(null);

    const cycleTheme = () => {
        const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
        const currentIndex = themes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex]);
    };

    const getThemeIcon = () => {
        if (theme === 'light') return <Sun size={14} />;
        if (theme === 'dark') return <Moon size={14} />;
        return <Monitor size={14} />;
    };

    // Helper to extract values from MathField
    const getValues = () => {
        if (!mathFieldRef.current) return { latex: "", ascii: "" };
        return {
            latex: mathFieldRef.current.getValue('latex'),
            ascii: mathFieldRef.current.getValue('ascii-math')
        };
    };

    const handleInput = () => {
        const { latex, ascii } = getValues();
        setExpression(latex);

        // Live Preview
        if (!ascii || !ascii.trim()) {
            setLiveResult(null);
            return;
        }
        try {
            // Get last result for Ans
            const lastResult = history.length > 0 && !history[history.length - 1].isError
                ? history[history.length - 1].result || "0"
                : "0";

            // Use LaTeX for evaluation to support complex nested structures
            const res = evaluateExpression(latex, angleMode, lastResult);
            setLiveResult(res);
        } catch (e) {
            setLiveResult(null);
        }
    };

    // Recalculate live result when angle mode changes
    useEffect(() => {
        handleInput();
    }, [angleMode]);

    const handleCommand = (command: string, arg?: string) => {
        const mf = mathFieldRef.current;
        if (!mf) return;

        if (command === 'insert') {
            mf.executeCommand(['insert', arg]);
        } else {
            mf.executeCommand([command, arg]);
        }
        // We don't strictly need mf.focus() here if we prevent default on button mousedown,
        // but it's a good safety fallback.
        mf.focus();
    };

    const handleBackspace = () => {
        const mf = mathFieldRef.current;
        if (mf) {
            mf.executeCommand('deleteBackward');
            mf.focus();
        }
    };

    const handleClearAll = () => {
        const mf = mathFieldRef.current;
        if (mf) {
            mf.setValue(''); // Clear the field
            setExpression("");
            setHistory([]);
            setLiveResult(null);
            mf.focus();
        }
    };

    const handleEnter = () => {
        const { latex, ascii } = getValues();
        if (!ascii || !ascii.trim()) return;

        let resultStr: string | null = null;
        let isError = false;

        try {
            // Get last result for Ans
            const lastResult = history.length > 0 && !history[history.length - 1].isError
                ? history[history.length - 1].result || "0"
                : "0";

            // Use LaTeX for evaluation
            resultStr = evaluateExpression(latex, angleMode, lastResult);
        } catch (e) {
            isError = true;
        }

        const newItem: HistoryItem = {
            id: Date.now().toString(),
            expression: latex,
            result: resultStr,
            isError
        };

        setHistory(prev => [...prev, newItem]);

        // Clear input
        const mf = mathFieldRef.current;
        if (mf) {
            mf.setValue('');
            setExpression("");
            setLiveResult(null);
        }
    };

    const handleHistoryItemClick = (latexOrValue: string) => {
        const mf = mathFieldRef.current;
        if (mf) {
            // If it's a value (number), insert it.
            // If it's complex latex, wrap in parens?
            // For now, just insert.
            mf.executeCommand(['insert', latexOrValue]);
            mf.focus();
        }
    };

    const handleUndo = () => {
        // Simple history undo: restore last expression to input
        if (history.length === 0) return;
        const last = history[history.length - 1];

        const mf = mathFieldRef.current;
        if (mf) {
            mf.setValue(last.expression);
            setExpression(last.expression);
            setHistory(prev => prev.slice(0, -1));
            mf.focus();
        }
    };

    return (
        <div
            className="flex flex-col h-screen w-full overflow-hidden"
            style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)', borderWidth: '1px' }}
            onMouseEnter={() => mathFieldRef.current?.focus()}
        >
            <TitleBar />
            {/* Header Removed */}

            {/* Main Calculator Container */}
            <div className="flex-1 flex flex-col w-full max-w-[800px] mx-auto shadow-xl my-0 sm:my-4 sm:rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-secondary)', borderWidth: '1px' }}>

                {/* Display Area */}
                <Display
                    history={history}
                    mathFieldRef={mathFieldRef}
                    onInput={handleInput}
                    onEnter={handleEnter}
                    currentResult={liveResult}
                    onHistoryItemClick={handleHistoryItemClick}
                    onFocus={() => { }}
                />

                {/* Control Bar */}
                <div className="flex items-center justify-between px-2 py-1 border-t h-[44px]" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>

                    {/* Tab Switchers */}
                    <div className="flex gap-1">
                        <Button
                            label="main"
                            onClick={() => setTabMode('MAIN')}
                            className="w-16 h-8 text-sm font-medium shadow-inner"
                            style={{
                                backgroundColor: tabMode === 'MAIN' ? 'var(--button-active)' : 'transparent',
                                color: tabMode === 'MAIN' ? 'var(--button-active-text)' : 'var(--button-inactive-text)'
                            }}
                            variant={ButtonVariant.DEFAULT}
                        />
                        <Button
                            label="func"
                            onClick={() => setTabMode('FUNC')}
                            className="w-16 h-8 text-sm font-medium shadow-inner"
                            style={{
                                backgroundColor: tabMode === 'FUNC' ? 'var(--button-active)' : 'transparent',
                                color: tabMode === 'FUNC' ? 'var(--button-active-text)' : 'var(--button-inactive-text)'
                            }}
                            variant={ButtonVariant.DEFAULT}
                        />
                    </div>

                    {/* Angle Toggle */}
                    <div className="flex rounded p-0.5" style={{ backgroundColor: 'var(--angle-toggle-bg)' }}>
                        <button
                            className="px-2 py-0.5 text-xs rounded shadow-sm"
                            style={{
                                backgroundColor: angleMode === 'DEG' ? 'var(--angle-toggle-active)' : 'transparent',
                                color: angleMode === 'DEG' ? 'var(--button-active-text)' : 'var(--button-inactive-text)'
                            }}
                            onClick={() => setAngleMode('DEG')}
                        >
                            deg
                        </button>
                        <button
                            className="px-2 py-0.5 text-xs rounded shadow-sm"
                            style={{
                                backgroundColor: angleMode === 'RAD' ? 'var(--angle-toggle-active)' : 'transparent',
                                color: angleMode === 'RAD' ? 'var(--button-active-text)' : 'var(--button-inactive-text)'
                            }}
                            onClick={() => setAngleMode('RAD')}
                        >
                            rad
                        </button>
                    </div>

                    {/* Tools */}
                    <div className="flex gap-2">
                        <Button label="theme" onClick={cycleTheme} display={getThemeIcon()} className="w-10 h-8 bg-transparent" style={{ color: 'var(--text-secondary)' }} variant={ButtonVariant.DEFAULT} onMouseEnter={(e: any) => e.currentTarget.style.backgroundColor = 'var(--button-hover)'} onMouseLeave={(e: any) => e.currentTarget.style.backgroundColor = 'transparent'} />
                        <Button label="undo" onClick={handleUndo} disabled={history.length === 0} display={<RotateCcw size={16} />} className="w-10 h-8 bg-transparent" style={{ color: 'var(--text-secondary)' }} variant={ButtonVariant.DEFAULT} />
                        <Button label="clear all" onClick={handleClearAll} className="px-2 h-8 text-sm bg-transparent" style={{ color: 'var(--text-secondary)' }} variant={ButtonVariant.DEFAULT} />
                    </div>

                </div>

                {/* Keypad Area */}
                <div className="h-[280px] w-full relative" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    <div className="flex h-full">
                        <div className="flex-1">
                            <Keypad tab={tabMode} onCommand={handleCommand} />
                        </div>

                        <div className="w-[15%] p-1 flex flex-col gap-1 border-l" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-tertiary)' }}>
                            <Button
                                label="backspace"
                                onClick={handleBackspace}
                                variant={ButtonVariant.DARK}
                                className="h-[20%]"
                                display={<ArrowLeft size={20} />}
                            />
                            <div className="flex-1"></div>
                            <Button
                                label="enter"
                                onClick={handleEnter}
                                variant={ButtonVariant.BLUE}
                                className="h-[40%]"
                                display={<span className="text-2xl">↵</span>}
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default App;