import React, { useState } from 'react';
import { NotesProvider } from './NotasContext';
import Navbar from './Navbar';
import NoteModal from './FormModal';
import CategoryCards from './CategoríasNotas';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend'; 
import './stylesNotas.css'; 

const NoteEditor: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<{ id: number; author: string; category: string; notes: string } | undefined>(undefined);

  const handleAddNote = () => {
    setEditingNote(undefined);
    setIsModalOpen(true);
  };

  const handleEditNote = (note: { id: number; author: string; category: string; notes: string }) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <NotesProvider>
        <Navbar />
        <div className="button-container">
          <button className="add-note-button" onClick={handleAddNote}>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
          <span className="material-symbols-outlined">
          add_notes
          </span>
          </button>
        </div>
        <CategoryCards onEdit={handleEditNote} />
        <NoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialNote={editingNote} />
      </NotesProvider>
    </DndProvider>
  );
};

export default NoteEditor;
