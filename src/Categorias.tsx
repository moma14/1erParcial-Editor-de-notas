import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './TiposdeItems';
import { Note } from './TiposCategorias';
import { useNotes } from './NotasContext';
import ConfirmModal from './ModalMessage';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  isExpanded: boolean;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, isExpanded }) => {
  const { dispatch } = useNotes();

  // Configuración del drag para mover una sola nota
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.NOTE,
    item: { note },
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
     {/* Mostrar los botones de editar/eliminar solo si el contenedor está expandido */}
      {isExpanded && (
        <div className="note-buttons">
          <button className="edit-button" onClick={() => setIsEditModalOpen(true)}>
            <span className="material-symbols-outlined">edit_note</span>
          </button>
          <button className="delete-button" onClick={handleDeleteNote}>
            <span className="material-symbols-outlined">delete</span>
          </button>
        </div>
      )}

      <h3>{note.author}</h3>
      <p>{note.notes}</p>
      {/* Modal de confirmación para eliminar */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        message="¿Estás seguro de que quieres eliminar esta nota?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />

      {/* Modal de confirmación para editar */}
      <ConfirmModal
        isOpen={isEditModalOpen}
        message="¿Estás seguro de que quieres editar esta nota?"
        onConfirm={handleConfirmEdit}
        onCancel={() => setIsEditModalOpen(false)}
      />
    </div>
  );
};

export default NoteCard;
