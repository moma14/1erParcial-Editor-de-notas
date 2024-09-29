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
  categories: string[]; 
}

const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose, initialNote, categories }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <NoteForm initialNote={initialNote} onSave={onClose} categories={categories} />
        <button  className="cerrar-modal" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default NoteModal;
