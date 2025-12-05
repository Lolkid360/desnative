import React, { useEffect, useRef } from 'react';
import { HistoryItem } from '../types';

// Bypass TypeScript check for custom element by casting it to any
// This avoids the need for global augmentation which can be flaky in some setups
const MathField = 'math-field' as any;

interface DisplayProps {
  history: HistoryItem[];
  // We pass the ref from App to control the math-field directly
  mathFieldRef: React.RefObject<any>;
  onInput: () => void;
  onEnter: () => void; // New prop for handling enter
  currentResult: string | null;
  onHistoryItemClick: (latex: string) => void;
  onFocus: () => void;
}

const Display: React.FC<DisplayProps> = ({
  history,
  mathFieldRef,
  onInput,
  onEnter,
  currentResult,
  onHistoryItemClick,
  onFocus
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when history updates
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      // Use setTimeout to allow render to finish
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      }, 0);
    }
  }, [history]);

  // Initialize MathField listeners
  useEffect(() => {
    const mf = mathFieldRef.current;
    if (mf) {
      // Configure math field
      mf.smartFence = true;
      mf.smartSuperscript = true;
      mf.virtualKeyboardMode = 'manual'; // Disable built-in virtual keyboard

      // Custom Shortcuts
      mf.inlineShortcuts = {
        ING: '\\int_{}^{}',
        ing: '\\int',
        DIR: '\\frac{d}{dx}',
        SIMP: 'simplify(',
        FACT: 'factor('
      };

      // Bind input event
      const handleInput = () => {
        onInput();
      };

      const handleFocus = () => {
        onFocus();
      };

      // Handle physical Enter key
      const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          onEnter();
        }
      };

      mf.addEventListener('input', handleInput);
      mf.addEventListener('focus', handleFocus);
      mf.addEventListener('keydown', handleKeydown);

      return () => {
        mf.removeEventListener('input', handleInput);
        mf.removeEventListener('focus', handleFocus);
        mf.removeEventListener('keydown', handleKeydown);
      };
    }
  }, [mathFieldRef, onInput, onFocus, onEnter]);

  // Focus on mount and when window gains focus
  useEffect(() => {
    const focusInput = () => {
      if (mathFieldRef.current) {
        mathFieldRef.current.focus();
      }
    };

    // Focus when window gains focus
    const handleWindowFocus = () => {
      setTimeout(focusInput, 100);
    };

    // Initial focus with delay
    // Initial focus - try immediately and with short delays
    focusInput(); // Try immediately
    setTimeout(focusInput, 50);
    setTimeout(focusInput, 150);
    setTimeout(focusInput, 300);
    // Also focus when window becomes focused
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      window.removeEventListener('focus', handleWindowFocus);
    };
    // Note: mathFieldRef is a stable ref, but including it documents the dependency
  }, [mathFieldRef]);

  return (
    <div className="flex-1 flex flex-col border-b min-h-0" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
      {/* History Area - Scrollable */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-0 display-scrollbar"
        onClick={() => mathFieldRef.current?.focus()}
      >
        {/* Spacer to push content to bottom when few items */}
        <div className="min-h-0" style={{ flexGrow: history.length < 5 ? 1 : 0 }} />

        {/* History Items */}
        {history.map((item) => (
          <div
            key={item.id}
            className="flex flex-col border-b transition-colors"
            style={{ borderColor: 'var(--border-secondary)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {/* Single Row with Expression and Result */}
            <div
              className="flex items-center justify-between px-4 py-2 min-h-[40px] overflow-x-auto history-item-scroll gap-4"
              style={{ width: '100%' }}
            >
              {/* Expression */}
              <div
                className="flex-shrink-0"
                style={{ display: 'inline-block' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onHistoryItemClick(item.expression);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  navigator.clipboard.writeText(item.expression).then(() => {
                    setTimeout(() => mathFieldRef.current?.focus(), 10);
                  }).catch(err => console.error('Failed to copy:', err));
                }}
                title="Click to insert, Right-click to copy"
              >
                <MathField
                  read-only
                  style={{
                    pointerEvents: 'none',
                    fontSize: '1.2rem',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {item.expression}
                </MathField>
              </div>

              {/* Result */}
              <div className="flex-shrink-0">
                {item.isError ? (
                  <span
                    className="px-2 py-1 rounded flex items-center gap-1 text-sm font-medium"
                    style={{ backgroundColor: 'var(--bg-error)', color: 'var(--text-error)' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    Error
                  </span>
                ) : (
                  <div
                    className="text-2xl font-bold px-2 py-1 rounded border flex items-center"
                    style={{
                      color: 'var(--text-primary)',
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'transparent',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                    onClick={(e) => {
                      e.stopPropagation();
                      onHistoryItemClick(item.result || "");
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      navigator.clipboard.writeText(item.result || "").then(() => {
                        setTimeout(() => mathFieldRef.current?.focus(), 10);
                      }).catch(err => console.error('Failed to copy:', err));
                    }}
                    title="Click to insert, Right-click to copy"
                  >
                    <span className="mr-2">=</span>
                    <MathField
                      read-only
                      style={{
                        pointerEvents: 'none',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: 'var(--text-primary)'
                      }}
                    >
                      {item.result}
                    </MathField>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Current Input - Fixed at Bottom */}
      <div className="flex flex-col border-l-4 min-h-[100px] relative shadow-sm flex-shrink-0" style={{ borderColor: '#2f72dc', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="flex-1 px-4 py-4 flex items-center">
          <MathField
            ref={mathFieldRef}
            virtual-keyboard-mode="manual"
          >
          </MathField>
        </div>
        {/* Live Preview Result */}
        <div className="px-4 py-2 text-right min-h-[40px] flex justify-end items-center">
          {currentResult && (
            <>
              <span className="text-xl font-normal mr-2" style={{ color: 'var(--text-secondary)' }}>=</span>
              <MathField
                read-only
                style={{
                  pointerEvents: 'none',
                  fontSize: '1.2rem',
                  color: 'var(--text-secondary)'
                }}
              >
                {currentResult}
              </MathField>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Display;
