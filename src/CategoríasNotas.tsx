import React, { useCallback, useState } from 'react';
import { useNotes } from './NotasContext';
import { useDrag, useDrop } from 'react-dnd';
import NoteCard from './Categorias';
import { ItemTypes } from './TiposdeItems';
import { Note } from './TiposCategorias';
import ConfirmModal from './ModalMessage';

interface CategoryCardsProps {
  categories: string[];
  onEdit: (note: Note) => void;
  setCategories: (categories: string[]) => void;
}

const CategoryCards: React.FC<CategoryCardsProps> = ({ categories, onEdit, setCategories }) => {
  const { notes, dispatch } = useNotes();

  const moveCategory = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const updatedCategories = [...categories];
      const [removed] = updatedCategories.splice(dragIndex, 1);
      updatedCategories.splice(hoverIndex, 0, removed);
      setCategories(updatedCategories);
    },
    [categories, setCategories]
  );

  const moveNoteToCategory = useCallback(
    (note: Note, newCategory: string) => {
      dispatch({ type: 'EDIT_NOTE', payload: { ...note, category: newCategory } });
    },
    [dispatch]
  );

  const handleDeleteCategory = useCallback(
    (categoryToDelete: string) => {
      notes
        .filter((note: Note) => note.category === categoryToDelete)
        .forEach((note: Note) => {
          dispatch({ type: 'DELETE_NOTE', payload: note.id });
        });
      setCategories(categories.filter((cat) => cat !== categoryToDelete));
    },
    [categories, notes, dispatch, setCategories]
  );

  return (
    <div className="cards-container">
      {categories.map((category, index) => (
        <CategoryCard
          key={category}
          index={index}
          category={category}
          notes={notes.filter((note: Note) => note.category === category)}
          onEdit={onEdit}
          onDropNote={moveNoteToCategory}
          moveCategory={moveCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      ))}
    </div>
  );
};

interface CategoryCardProps {
  category: string;
  notes: Note[];
  onEdit: (note: Note) => void;
  onDropNote: (note: Note, newCategory: string) => void;
  moveCategory: (dragIndex: number, hoverIndex: number) => void;
  index: number;
  onDeleteCategory: (category: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  notes,
  onEdit,
  onDropNote,
  moveCategory,
  index,
  onDeleteCategory,
}) => {
  const [{ isDragging: isCategoryDragging }, dragCategory] = useDrag({
    type: ItemTypes.CATEGORY,
    item: { index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, dropCategory] = useDrop({
    accept: ItemTypes.CATEGORY,
    hover(item: { index: number }) {
      if (item.index !== index) {
        moveCategory(item.index, index);
        item.index = index;
      }
    },
  });

  const [{ isDragging: isNotesDragging }, dragNotesContainer] = useDrag({
    type: ItemTypes.NOTES_CONTAINER,
    item: { category, notes },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, dropNotesContainer] = useDrop({
    accept: ItemTypes.NOTES_CONTAINER,
    drop: (item: { category: string; notes: Note[] }) => {
      item.notes.forEach((note) => {
        onDropNote(note, category);
      });
    },
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewNotesModalOpen, setIsViewNotesModalOpen] = useState(false);

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    onDeleteCategory(category);
    setIsDeleteModalOpen(false);
  };

  const handleViewNotes = () => {
    setIsViewNotesModalOpen(true);
  };

  const handleDragStartNote = () => {
    setIsViewNotesModalOpen(false); 
  };

  return (
    <div
      ref={(node) => dragCategory(dropCategory(node))} 
      className="category-card"
      style={{ opacity: isCategoryDragging ? 0.5 : 1 }}
    >
      <div className="note-button2">
        <button onClick={handleDelete} className="borrar-categoria">
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
          <span className="material-symbols-outlined">delete</span>
        </button>
      </div>
      <h2>{category}</h2>

      {/* Contenedor de notas arrastrable como unidad */}
      <div
        ref={(node) => dragNotesContainer(dropNotesContainer(node))} 
        className="notes-container"
        style={{ opacity: isNotesDragging ? 0.5 : 1, cursor: 'pointer' }}
        onClick={handleViewNotes}
      >
        {notes.length === 0 && <p className="empty-placeholder">Suelta una nota aquí</p>}
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} onEdit={onEdit} />
        ))}
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        message={`¿Estás seguro de que deseas eliminar la categoría "${category}" y todas sus notas?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />

      {/* Modal para ver todas las notas sin encimarse */}
      {isViewNotesModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Notas en la categoría "{category}"</h2>
            <div className="all-notes-container" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {notes.map((note) => (
                <NoteCardInModal 
                  key={note.id} 
                  note={note} 
                  onEdit={onEdit} 
                  onDragStart={handleDragStartNote} 
                  onDrop={onDropNote}
                />
              ))}
            </div>
            <button className="close-button" onClick={() => setIsViewNotesModalOpen(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

interface NoteCardInModalProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDragStart: () => void;
  onDrop: (note: Note, newCategory: string) => void;
}

const NoteCardInModal: React.FC<NoteCardInModalProps> = ({ note, onEdit, onDragStart, onDrop }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.NOTE,
    item: note,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.NOTE,
    drop: (item: Note) => onDrop(item, note.category),
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className="note-card"
      style={{ position: 'relative', width: '100%', height: 'auto', opacity: isDragging ? 0.5 : 1 }}
      onDragStart={onDragStart} 
    >
      <h3>{note.author}</h3>
      <p>{note.notes}</p>
      <div className="note-buttons">
        <button className="edit-button" onClick={() => onEdit(note)}>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
          <span className="material-symbols-outlined">edit_note</span>
        </button>
      </div>
    </div>
  );
};

export default CategoryCards;
