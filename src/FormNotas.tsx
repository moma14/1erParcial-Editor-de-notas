import React, { useState, FormEvent, useEffect } from 'react';
import { z } from 'zod';
import { useNotes } from './NotasContext';

interface NoteFormProps {
  initialNote?: {
    id: number;
    author: string;
    category: string;
    notes: string;
  };
  onSave: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ initialNote, onSave }) => {
  const { dispatch } = useNotes();

  // Estados para los campos del formulario
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');

  // UseEffect para cargar los datos de la nota cuando se edita
  useEffect(() => {
    if (initialNote) {
      setAuthor(initialNote.author);
      setCategory(initialNote.category);
      setNotes(initialNote.notes);
    } else {
      // con esto se limpian los campos si no hay nota inicial (modo de añadir)
      setAuthor('');
      setCategory('');
      setNotes('');
    }
  }, [initialNote]);

  // Esquema de validación con Zod
  const noteSchema = z.object({
    author: z.string().min(1, 'El autor es requerido'),
    category: z.string().min(1, 'La categoría es requerida'),
    notes: z.string().min(1, 'Las notas son requeridas'),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validation = noteSchema.safeParse({ author, category, notes });
    if (!validation.success) {
      alert('Se necesitan llenar todos los campos');
      return;
    }

    const note = {
      id: initialNote?.id || Date.now(),
      author,
      category,
      notes,
    };

    if (initialNote) {
      dispatch({ type: 'EDIT_NOTE', payload: note });
    } else {
      dispatch({ type: 'ADD_NOTE', payload: note });
      // con esto se limpian los campos después de guardar
      setAuthor('');
      setCategory('');
      setNotes('');
    }

    onSave();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Autor"
      />
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Categoría"
      />
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notas"
      />
      <button type="submit">{initialNote ? 'Guardar Cambios' : 'Guardar'}</button>
    </form>
  );
};

export default NoteForm;
