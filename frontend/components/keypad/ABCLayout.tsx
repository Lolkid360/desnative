import React from 'react';
import Button from '../Button';
import { ButtonVariant } from '../../types';

interface ABCLayoutProps {
    onCommand: (command: string, arg?: string) => void;
}

const ABCLayout: React.FC<ABCLayoutProps> = ({ onCommand }) => {
    const ins = (val: string) => () => onCommand('insert', val);

    return (
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
};

export default ABCLayout;
