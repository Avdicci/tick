import React, { useState } from 'react';

type AddTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description: string) => void;
};

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim()) {
      return;
    }
    onSave(name.trim(), description.trim());
    setName('');
    setDescription('');
    onClose();
  };

  const handleBackdropClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal">
        <h2 className="modal__title">New Micro-Grind</h2>
        <label className="modal__label">
          <span>Name *</span>
          <input
            className="modal__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Stretch, Dish Run, Study Burst"
          />
        </label>
        <label className="modal__label">
          <span>Description</span>
          <textarea
            className="modal__textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional flavor text or specifics"
            rows={3}
          />
        </label>
        <div className="modal__actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn--primary"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};


