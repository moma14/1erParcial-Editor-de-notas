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
      <h3>{note.author}</h3>
      <p>{note.notes}</p>
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
          Editar Nota
        </button>
        <button
          className="delete-button"
          onClick={handleDeleteNote}
        >
          Eliminar Nota
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
