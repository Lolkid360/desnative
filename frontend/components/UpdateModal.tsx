import React from 'react';
import Button from './Button';
import { ButtonVariant } from '../types';
import { Download, X } from 'lucide-react';

interface UpdateInfo {
    available: boolean;
    version: string;
    downloadUrl: string;
    releaseNotes: string;
}

interface UpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    updateInfo: UpdateInfo | null;
    onDownload: () => void;
    downloadComplete?: boolean;
}

const UpdateModal: React.FC<UpdateModalProps> = ({ isOpen, onClose, updateInfo, onDownload, downloadComplete }) => {
    if (!isOpen || !updateInfo) return null;

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
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <Download size={24} className="text-blue-500" />
                        {downloadComplete ? "Update Downloaded" : "Update Available"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded hover:bg-opacity-10"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {downloadComplete ? (
                    <div className="mb-6">
                        <p className="mb-4" style={{ color: 'var(--text-primary)' }}>
                            The update has been downloaded to your <strong>Downloads</strong> folder.
                        </p>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Please close the app and replace the executable with the new version.
                        </p>
                        <div className="flex justify-end mt-6">
                            <Button
                                label="Close"
                                onClick={onClose}
                                variant={ButtonVariant.BLUE}
                                className="px-4"
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="mb-6">
                            <p className="mb-2" style={{ color: 'var(--text-primary)' }}>
                                A new version <strong>{updateInfo.version}</strong> is available.
                            </p>
                            <div
                                className="p-3 rounded text-sm mb-4 max-h-[150px] overflow-y-auto"
                                style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                            >
                                <p className="font-bold mb-1">Release Notes:</p>
                                <p>{updateInfo.releaseNotes || "No release notes provided."}</p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                label="Skip"
                                onClick={onClose}
                                variant={ButtonVariant.DEFAULT}
                                className="px-4"
                            />
                            <Button
                                label="Download"
                                onClick={onDownload}
                                variant={ButtonVariant.BLUE}
                                className="px-4"
                                display={<span className="flex items-center gap-2"><Download size={16} /> Download</span>}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default UpdateModal;
