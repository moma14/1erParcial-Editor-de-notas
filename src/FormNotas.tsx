import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useNotes } from './NotasContext';
import ConfirmModal from './ModalMessage'; 

interface NoteFormProps {
  initialNote?: {
    id: number;
    author: string;
    category: string;
    notes: string;
  };
  onSave: () => void;
  categories: string[]; 
}

const NoteForm: React.FC<NoteFormProps> = ({ initialNote, onSave, categories }) => {
  const { dispatch } = useNotes();

  // estos son los estados para los campos del formulario
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');

  // estados para el modal de alerta
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  // aqui se carga los datos de la nota cuando se edita
  useEffect(() => {
    if (initialNote) {
      setAuthor(initialNote.author);
      setCategory(initialNote.category);
      setNotes(initialNote.notes);
    } else {
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

  const handleSaveClick = () => {
    const validation = noteSchema.safeParse({ author, category, notes });
    if (!validation.success) {
      setIsAlertModalOpen(true); // Abre el modal si la validación falla
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
      setAuthor('');
      setCategory('');
      setNotes('');
    }

    onSave(); 
  };

  return (
    <>
      <form>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Autor"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="" disabled>
            Seleccionar Categoría
          </option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notas"
        />
      </form>
      {/* Botón de guardar con onClick */}
      <button className="guardar-modal" onClick={handleSaveClick} type="button">
        <span className="material-symbols-outlined">save</span>
      </button>

      {/* Modal de alerta para campos vacíos */}
      <ConfirmModal
        isOpen={isAlertModalOpen}
        message="Se necesitan llenar todos los campos"
        onConfirm={() => setIsAlertModalOpen(false)} 
        onCancel={() => setIsAlertModalOpen(false)} 
      />
    </>
  );
};

export default NoteForm;
