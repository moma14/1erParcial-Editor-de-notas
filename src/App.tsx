import React, { useState } from 'react';
import { NotesProvider } from './NotasContext';
import Navbar from './Navbar';
import NoteList from './PropsLists';
import NoteModal from './FormModal';
import './stylesNotas.css'; 

const NoteEditor: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<{ id: number; author: string; category: string; notes: string } | undefined>(undefined);

  // esta función es para abrir un modal cuando se apreta el botón de agregar
  const handleAddNote = () => {
    setEditingNote(undefined); // con esto se asegura que el formulario esté vacío al agregar una nueva nota
    setIsModalOpen(true);
  };

  // esta función es para abrir cuando se intenta editar el boton
  const handleEditNote = (note: { id: number; author: string; category: string; notes: string }) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  return (
    <NotesProvider>
        {/* Navbar con el título */}
        <Navbar />
        {/* este botón es el de agregar nota que esta debajo del navbar */}
        <div className="button-container">
          <button className="add-note-button" onClick={handleAddNote}>
            Agregar Nota
          </button>
        </div>
      <div className='notas-container'>
        {/* esta es la lista de notas con la opción de editar */}
        <NoteList onEdit={handleEditNote} />

        {/* este modal es para agregar o editar una nota */}
        <NoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialNote={editingNote} />
        </div>
    </NotesProvider>
  );
};

export default NoteEditor;
