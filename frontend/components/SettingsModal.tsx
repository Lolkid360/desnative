import React from 'react';
import { Sun, Moon, Monitor, X } from 'lucide-react';
import Button from './Button';
import { ButtonVariant } from '../types';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    theme: 'light' | 'dark' | 'system';
    onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
    outputFormat: 'decimal' | 'fraction';
    onOutputFormatChange: (format: 'decimal' | 'fraction') => void;
    onExport: () => void;
    onImport: () => void;
    checkForUpdates: boolean;
    onCheckForUpdatesChange: (enabled: boolean) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    theme,
    onThemeChange,
    outputFormat,
    onOutputFormatChange,
    onExport,
    onImport,
    checkForUpdates,
    onCheckForUpdatesChange
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={onClose}
        >
            <div
                className="rounded-lg shadow-xl p-6 w-[400px] max-w-[90vw]"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', borderWidth: '1px' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Settings</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded hover:bg-opacity-10"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Theme */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                        Theme
                    </label>
                    <div className="flex gap-2">
                        <Button
                            label="light"
                            onClick={() => onThemeChange('light')}
                            display={<Sun size={16} />}
                            className="flex-1 h-10"
                            variant={ButtonVariant.DEFAULT}
                            style={{
                                backgroundColor: theme === 'light' ? 'var(--button-active)' : 'var(--bg-tertiary)',
                                color: theme === 'light' ? 'var(--button-active-text)' : 'var(--text-secondary)'
                            }}
                        />
                        <Button
                            label="dark"
                            onClick={() => onThemeChange('dark')}
                            display={<Moon size={16} />}
                            className="flex-1 h-10"
                            variant={ButtonVariant.DEFAULT}
                            style={{
                                backgroundColor: theme === 'dark' ? 'var(--button-active)' : 'var(--bg-tertiary)',
                                color: theme === 'dark' ? 'var(--button-active-text)' : 'var(--text-secondary)'
                            }}
                        />
                        <Button
                            label="system"
                            onClick={() => onThemeChange('system')}
                            display={<Monitor size={16} />}
                            className="flex-1 h-10"
                            variant={ButtonVariant.DEFAULT}
                            style={{
                                backgroundColor: theme === 'system' ? 'var(--button-active)' : 'var(--bg-tertiary)',
                                color: theme === 'system' ? 'var(--button-active-text)' : 'var(--text-secondary)'
                            }}
                        />
                    </div>
                </div>

                {/* Output Format */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                        Output Format
                    </label>
                    <div className="flex gap-2">
                        <Button
                            label="decimal"
                            onClick={() => onOutputFormatChange('decimal')}
                            className="flex-1 h-10"
                            variant={ButtonVariant.DEFAULT}
                            style={{
                                backgroundColor: outputFormat === 'decimal' ? 'var(--button-active)' : 'var(--bg-tertiary)',
                                color: outputFormat === 'decimal' ? 'var(--button-active-text)' : 'var(--text-secondary)'
                            }}
                        />
                        <Button
                            label="fraction"
                            onClick={() => onOutputFormatChange('fraction')}
                            className="flex-1 h-10"
                            variant={ButtonVariant.DEFAULT}
                            style={{
                                backgroundColor: outputFormat === 'fraction' ? 'var(--button-active)' : 'var(--bg-tertiary)',
                                color: outputFormat === 'fraction' ? 'var(--button-active-text)' : 'var(--text-secondary)'
                            }}
                        />
                    </div>
                </div>

                {/* History */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                        History
                    </label>
                    <div className="flex gap-2">
                        <Button
                            label="Export"
                            onClick={onExport}
                            className="flex-1 h-10"
                            variant={ButtonVariant.LIGHT}
                        />
                        <Button
                            label="Import"
                            onClick={onImport}
                            className="flex-1 h-10"
                            variant={ButtonVariant.LIGHT}
                        />
                    </div>
                </div>

                {/* Updates */}
                <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                        Updates
                    </label>
                    <div className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                        <span style={{ color: 'var(--text-primary)' }}>Check for updates automatically</span>
                        <input
                            type="checkbox"
                            checked={checkForUpdates}
                            onChange={(e) => onCheckForUpdatesChange(e.target.checked)}
                            className="w-4 h-4"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
