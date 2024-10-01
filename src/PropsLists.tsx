import React from 'react';
import { useNotes } from './NotasContext';

interface NoteListProps {
  onEdit: (note: { id: number; author: string; category: string; notes: string }) => void;
}

const NoteList: React.FC<NoteListProps> = ({ onEdit }) => {
  const { notes } = useNotes();



  return (
    <div>
      {notes.map((note) => (
        <div key={note.id}>
          <h3>{note.author}</h3>
          <p>{note.category}</p>
          <p>{note.notes}</p>
          <button onClick={() => onEdit(note)}>Editar</button>
          <button>Eliminar</button>
        </div>
      ))}
    </div>
  );
};

export default NoteList;
