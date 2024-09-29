import React, { useCallback, useState } from 'react';
import { useNotes } from './NotasContext';
import { useDrag, useDrop } from 'react-dnd';
import NoteCard from './Categorias'; 
import { ItemTypes } from './TiposdeItems';
import { Note } from './TiposCategorias';


const initialCategories = ['Animales', 'Música', 'Comida', 'Deporte', 'Entretenimiento'];

interface CategoryCardsProps {
  onEdit: (note: Note) => void;
}

const CategoryCards: React.FC<CategoryCardsProps> = ({ onEdit }) => {
  const { notes, dispatch } = useNotes();
  const [categories, setCategories] = useState(initialCategories);

  // esta función es para mover categorías completas
  const moveCategory = useCallback((dragIndex: number, hoverIndex: number) => {
    const updatedCategories = [...categories];
    const [removed] = updatedCategories.splice(dragIndex, 1);
    updatedCategories.splice(hoverIndex, 0, removed);
    setCategories(updatedCategories);
  }, [categories]);

  // esta función es para mover notas entre categorías
  const moveNoteToCategory = useCallback((note: Note, newCategory: string) => {
    dispatch({ type: 'EDIT_NOTE', payload: { ...note, category: newCategory } });
  }, [dispatch]);

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
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, notes, onEdit, onDropNote, moveCategory, index }) => {
  // aqui se configura el drag para poder mover la tarjeta de categoría completa
  const [{ isDragging: isCategoryDragging }, dragCategory] = useDrag({
    type: ItemTypes.CATEGORY,
    item: { index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  // esta configuración de drop es para permitir soltar otras categorías
  const [, dropCategory] = useDrop({
    accept: ItemTypes.CATEGORY,
    hover(item: { index: number }) {
      if (item.index !== index) {
        moveCategory(item.index, index);
        item.index = index;
      }
    },
  });

  // esta configuración de drop es para las notas dentro de la categoría
  const [, dropNote] = useDrop({
    accept: ItemTypes.NOTE,
    drop: (item: Note) => onDropNote(item, category),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={(node) => dragCategory(dropCategory(node))} // Permite arrastrar y soltar categorías
      className="category-card"
      style={{ opacity: isCategoryDragging ? 0.5 : 1 }}
    >
      <h2>{category}</h2>
      {/* aqui permite soltar notas incluso si no hay ninguna nota dentro de la categoria*/}
      <div ref={dropNote} className="notes-container">
        {notes.length === 0 && <p className="empty-placeholder">Suelta una nota aquí</p>}
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} onEdit={onEdit} />
        ))}
      </div>
    </div>
  );
};

export default CategoryCards;
