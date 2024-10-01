import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './TiposdeItems';
import { Note } from './TiposCategorias';
import { useNotes } from './NotasContext'; 

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit }) => {
  const { dispatch } = useNotes(); 

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.NOTE,
    item: note,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleDeleteNote = () => {
    const confirmDelete = window.confirm('¿Estás seguro que quieres eliminar esta nota?');
    if (confirmDelete) {
      dispatch({ type: 'DELETE_NOTE', payload: note.id }); // este dispatch es para eliminar la nota
    }
  };

  return (
    <div
      ref={drag}
      className="note-card"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="note-buttons">
        <button
          className="edit-button"
          onClick={() => {
            const confirmEdit = window.confirm('¿Estás seguro que quieres editar esta nota?');
            if (confirmEdit) {
              onEdit(note);
            }
          }}
        >
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
        <span className="material-symbols-outlined">edit_note</span>
        </button>
        <button
          className="delete-button"
          onClick={handleDeleteNote}
        >
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
        <span className="material-symbols-outlined">delete</span>
        </button>
      </div>
      <h3>{note.author}</h3>
      <p>{note.notes}</p>
    </div>
  );
};

export default NoteCard;
