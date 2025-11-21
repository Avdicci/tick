import React from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onCancel()}>
            <div className="modal">
                <h2 className="modal__title">{title}</h2>
                <p style={{ fontSize: '14px', color: '#666', margin: '0 0 16px 0' }}>{message}</p>
                <div className="modal__actions">
                    <button className="btn btn--ghost" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="btn btn--primary" onClick={onConfirm} style={{ background: '#ff3b30', borderColor: '#ff3b30' }}>
                        Clear All
                    </button>
                </div>
            </div>
        </div>
    );
};
