import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
    title: string;
    description: string;
    example?: string;
    children: React.ReactElement;
}

const Tooltip: React.FC<TooltipProps> = ({ title, description, example, children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const [position, setPosition] = useState<'top' | 'bottom'>('top');
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [shift, setShift] = useState(0);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const updatePosition = () => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const spaceAbove = rect.top;
            const spaceBelow = window.innerHeight - rect.bottom;

            // Decide position
            const newPosition = spaceAbove > spaceBelow ? 'top' : 'bottom';
            setPosition(newPosition);

            // Calculate coordinates
            // Center horizontally relative to the target element
            const left = rect.left + rect.width / 2;

            // Position vertically
            const top = newPosition === 'top' ? rect.top : rect.bottom;

            setCoords({ top, left });
            setShift(0); // Reset shift
        }
    };

    const handleMouseEnter = () => {
        timeoutRef.current = setTimeout(() => {
            updatePosition();
            setIsVisible(true);
        }, 300); // 300ms delay
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
    };

    // Clamp position after render
    React.useLayoutEffect(() => {
        if (isVisible && tooltipRef.current) {
            const rect = tooltipRef.current.getBoundingClientRect();
            const padding = 10; // Keep 10px from edge

            let newShift = 0;
            if (rect.left < padding) {
                newShift = padding - rect.left;
            } else if (rect.right > window.innerWidth - padding) {
                newShift = (window.innerWidth - padding) - rect.right;
            }

            if (newShift !== 0) {
                setShift(prev => prev + newShift);
            }
        }
    }, [isVisible]);

    useEffect(() => {
        // Update position on scroll or resize while visible
        if (isVisible) {
            window.addEventListener('scroll', updatePosition, true);
            window.addEventListener('resize', updatePosition);
        }
        return () => {
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [isVisible]);

    const tooltipContent = (
        <div
            ref={tooltipRef}
            className="fixed z-[9999] pointer-events-none"
            style={{
                top: coords.top,
                left: coords.left,
                transform: `translate(calc(-50% + ${shift}px), ${position === 'top' ? '-100%' : '0'})`,
                marginTop: position === 'bottom' ? '8px' : '0',
                marginBottom: position === 'top' ? '8px' : '0',
                minWidth: '200px',
                maxWidth: '280px',
            }}
        >
            <div
                className="rounded-lg shadow-lg p-3 text-left relative"
                style={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-primary)',
                    color: 'var(--text-primary)',
                }}
            >
                <div className="font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                    {title}
                </div>
                <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                    {description}
                </div>
                {example && (
                    <div
                        className="text-xs font-mono px-2 py-1 rounded"
                        style={{
                            backgroundColor: 'var(--bg-tertiary)',
                            color: 'var(--text-primary)'
                        }}
                    >
                        {example}
                    </div>
                )}

                {/* Arrow - Adjust position based on shift to keep pointing at target */}
                <div
                    className={`absolute left-1/2 -translate-x-1/2 w-0 h-0 ${position === 'top' ? 'top-full' : 'bottom-full'
                        }`}
                    style={{
                        borderLeft: '6px solid transparent',
                        borderRight: '6px solid transparent',
                        [position === 'top' ? 'borderTop' : 'borderBottom']: '6px solid var(--border-primary)',
                        transform: `translateX(${-shift}px)`
                    }}
                />
                {/* Arrow Inner (for border effect) */}
                <div
                    className={`absolute left-1/2 -translate-x-1/2 w-0 h-0 ${position === 'top' ? 'top-full' : 'bottom-full'
                        }`}
                    style={{
                        borderLeft: '5px solid transparent',
                        borderRight: '5px solid transparent',
                        [position === 'top' ? 'borderTop' : 'borderBottom']: '5px solid var(--bg-primary)',
                        marginTop: position === 'top' ? '-1px' : '1px',
                        transform: `translateX(${-shift}px)`
                    }}
                />
            </div>
        </div>
    );

    return (
        <>
            <div
                ref={containerRef}
                className="relative block w-full h-full"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {React.cloneElement(children, {
                    className: `${children.props.className || ''} w-full h-full`
                })}
            </div>
            {isVisible && createPortal(tooltipContent, document.body)}
        </>
    );
};

export default Tooltip;
