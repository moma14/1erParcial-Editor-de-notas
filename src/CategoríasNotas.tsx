import React, { useCallback, useState } from 'react';
import { useNotes } from './NotasContext';
import { useDrag, useDrop } from 'react-dnd';
import NoteCard from './Categorias'; 
import { ItemTypes } from './TiposdeItems';
import { Note } from './TiposCategorias';
import ConfirmModal from './ModalMessage';
import Tooltip from '@mui/material/Tooltip'; 

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
  // este drag es para mover el contenedor completo
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

  // este drop es para mover las notas individualmente
  const [, dropNote] = useDrop({
    accept: ItemTypes.NOTE,
    drop: (item: { note: Note }) => {
      onDropNote(item.note, category);
    },
  });

  // este drag es para mover el contenedor de notas completo
  const [{ isDragging: isNotesContainerDragging }, dragNotesContainer] = useDrag({
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
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    onDeleteCategory(category);
    setIsDeleteModalOpen(false);
  };

  const toggleExpand = () => {
    setIsExpanded((prevState) => !prevState);
  };

  return (
    <div
      ref={(node) => dragCategory(dropCategory(node))}
      className={`category-card ${isExpanded ? 'expanded' : ''}`}
      style={{ opacity: isCategoryDragging ? 0.5 : 1 }}
    >
      <div className="note-button2">
        <Tooltip title="Eliminar categoría" arrow>
          <button onClick={handleDelete} className="borrar-categoria">
            <span className="material-symbols-outlined">delete</span>
          </button>
        </Tooltip>
      </div>
      <h2>{category}</h2>

      {/* Contenedor de notas */}
      <div
        ref={(node) => dragNotesContainer(dropNotesContainer(dropNote(node)))}
        className={`notes-container ${isExpanded ? 'expanded' : ''}`}
        style={{ opacity: isNotesContainerDragging ? 0.5 : 1, cursor: 'pointer' }}
        onClick={toggleExpand}
      >
        {notes.length === 0 && <p className="empty-placeholder">Suelta una nota aquí</p>}
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} onEdit={onEdit} isExpanded={isExpanded} />
        ))}
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        message={`¿Estás seguro de que deseas eliminar la categoría "${category}" y todas sus notas?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default CategoryCards;
