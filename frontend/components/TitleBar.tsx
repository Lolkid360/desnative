import React, { useState, useEffect } from 'react';
import { Minus, Square, X, Pin } from 'lucide-react';
import { WindowMinimise, WindowMaximise, Quit } from '../wailsjs/runtime/runtime';
import { ToggleAlwaysOnTop, IsAlwaysOnTop } from '../wailsjs/go/main/App';

const TitleBar: React.FC = () => {
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
    const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(false);

    useEffect(() => {
        // Check initial always-on-top state
        IsAlwaysOnTop().then(setIsAlwaysOnTop);
    }, []);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setContextMenuPos({ x: e.clientX, y: e.clientY });
        setShowContextMenu(true);
    };

    const handleToggleAlwaysOnTop = async () => {
        const newState = await ToggleAlwaysOnTop();
        setIsAlwaysOnTop(newState);
        setShowContextMenu(false);
    };

    useEffect(() => {
        const handleClick = () => setShowContextMenu(false);
        if (showContextMenu) {
            document.addEventListener('click', handleClick);
            return () => document.removeEventListener('click', handleClick);
        }
    }, [showContextMenu]);

    return (
        <>
            <div
                className="h-[32px] w-full flex items-center justify-between border-b select-none flex-shrink-0"
                style={{
                    '--wails-draggable': 'drag',
                    backgroundColor: 'var(--bg-titlebar)',
                    borderColor: 'var(--border-primary)'
                } as React.CSSProperties}
                onContextMenu={handleContextMenu}
            >
                <div className="px-3 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Desnative Calculator</div>
                <div className="flex h-full" style={{ '--wails-draggable': 'no-drag' } as React.CSSProperties}>
                    <button
                        onClick={WindowMinimise}
                        className="h-full px-4 flex items-center justify-center transition-colors"
                        style={{ backgroundColor: 'transparent' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--button-hover)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <Minus size={16} style={{ color: 'var(--text-secondary)' }} />
                    </button>
                    <button
                        onClick={WindowMaximise}
                        className="h-full px-4 flex items-center justify-center transition-colors"
                        style={{ backgroundColor: 'transparent' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--button-hover)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <Square size={14} style={{ color: 'var(--text-secondary)' }} />
                    </button>
                    <button
                        onClick={Quit}
                        className="h-full px-4 flex items-center justify-center transition-colors group"
                        style={{ backgroundColor: 'transparent' }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#ef4444';
                            const icon = e.currentTarget.querySelector('svg');
                            if (icon) (icon as SVGElement).style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            const icon = e.currentTarget.querySelector('svg');
                            if (icon) (icon as SVGElement).style.color = 'var(--text-secondary)';
                        }}
                    >
                        <X size={16} style={{ color: 'var(--text-secondary)' }} />
                    </button>
                </div>
            </div>

            {/* Context Menu */}
            {showContextMenu && (
                <div
                    className="fixed z-50 py-1 rounded shadow-lg border min-w-[180px]"
                    style={{
                        left: `${contextMenuPos.x}px`,
                        top: `${contextMenuPos.y}px`,
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-primary)'
                    }}
                >
                    <button
                        onClick={handleToggleAlwaysOnTop}
                        className="w-full px-4 py-2 text-left flex items-center gap-2 text-sm"
                        style={{ color: 'var(--text-primary)' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <Pin size={14} style={{ opacity: isAlwaysOnTop ? 1 : 0.5 }} />
                        {isAlwaysOnTop ? 'Unpin from Top' : 'Always on Top'}
                    </button>
                </div>
            )}
        </>
    );
};

export default TitleBar;
