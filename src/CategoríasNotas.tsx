import React, { useCallback } from 'react';
import { useNotes } from './NotasContext';
import { useDrop } from 'react-dnd';
import NoteCard from './Categorias';
import { ItemTypes } from './TiposdeItems';
import { Note } from './TiposCategorias'; 

const categories = ['Animales', 'Música', 'Comida', 'Deporte', 'Entretenimiento'];

interface CategoryCardsProps {
  onEdit: (note: Note) => void;
}

const CategoryCards: React.FC<CategoryCardsProps> = ({ onEdit }) => {
  const { notes, dispatch } = useNotes();

  const moveNoteToCategory = useCallback((note: Note, newCategory: string) => {
    dispatch({ type: 'EDIT_NOTE', payload: { ...note, category: newCategory } });
  }, [dispatch]);

  return (
    <div className="cards-container">
      {categories.map((category) => (
        <CategoryCard 
          key={category} 
          category={category} 
          notes={notes.filter((note: Note) => note.category === category)} 
          onEdit={onEdit} 
          onDropNote={moveNoteToCategory}
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
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, notes, onEdit, onDropNote }) => {
  const [, drop] = useDrop({
    accept: ItemTypes.NOTE,
    drop: (item: Note) => onDropNote(item, category),
  });

  return (
    <div ref={drop} className="category-card">
      <h2>{category}</h2>
      <div className="notes-container">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} onEdit={onEdit} />
        ))}
      </div>
    </div>
  );
};

export default CategoryCards;
