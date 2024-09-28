import React from 'react';
import { useNotes } from './NotasContext';

interface NoteListProps {
  onEdit: (note: { id: number; author: string; category: string; notes: string }) => void;
}

const NoteList: React.FC<NoteListProps> = ({ onEdit }) => {
  const { notes, dispatch } = useNotes();

  const handleDelete = (id: number) => {
    // Muestra una confirmación antes de que se elimine la nota
    const confirmDelete = window.confirm('¿Quieres eliminar esta nota?');
    if (confirmDelete) {
      dispatch({ type: 'DELETE_NOTE', payload: id });
    }
  };

  return (
    <div>
      {notes.map((note) => (
        <div key={note.id}>
          <h3>{note.author}</h3>
          <p>{note.category}</p>
          <p>{note.notes}</p>
          <button onClick={() => onEdit(note)}>Editar</button>
          <button onClick={() => handleDelete(note.id)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
};

export default NoteList;
