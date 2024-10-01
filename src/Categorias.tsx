import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './TiposdeItems';
import { Note } from './TiposCategorias';
import { useNotes } from './NotasContext'; 
import ConfirmModal from './ModalMessage'; 

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

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDeleteNote = () => {
    setIsDeleteModalOpen(true); 
  };

  const handleConfirmDelete = () => {
    dispatch({ type: 'DELETE_NOTE', payload: note.id });
    setIsDeleteModalOpen(false); 
  };

  const handleConfirmEdit = () => {
    onEdit(note);
    setIsEditModalOpen(false); 
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
          onClick={() => setIsEditModalOpen(true)} 
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

      {/* Modal de confirmación para eliminar */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        message="¿Estás seguro que quieres eliminar esta nota?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />

      {/* Modal de confirmación para editar */}
      <ConfirmModal
        isOpen={isEditModalOpen}
        message="¿Estás seguro que quieres editar esta nota?"
        onConfirm={handleConfirmEdit}
        onCancel={() => setIsEditModalOpen(false)}
      />
    </div>
  );
};

export default NoteCard;
