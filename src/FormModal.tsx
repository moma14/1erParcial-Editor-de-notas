import React from 'react';
import NoteForm from './FormNotas';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialNote?: {
    id: number;
    author: string;
    category: string;
    notes: string;
  };
}

const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose, initialNote }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <NoteForm initialNote={initialNote} onSave={onClose} />
      </div>
    </div>
  );
};

export default NoteModal;
