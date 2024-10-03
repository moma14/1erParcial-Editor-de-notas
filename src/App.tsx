import React, { useState } from 'react';
import { NotesProvider } from './NotasContext';
import Navbar from './Navbar';
import NoteModal from './FormModal';
import CategoryCards from './CategoríasNotas';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend'; 
import './stylesNotas.css'; 
import ConfirmModal from './ModalMessage';
import Tooltip from '@mui/material/Tooltip'; // Importa el componente Tooltip

const NoteEditor: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<{ id: number; author: string; category: string; notes: string } | undefined>(undefined);
  const [categories, setCategories] = useState<string[]>(['Animales', 'Música', 'Comida', 'Deporte', 'Entretenimiento']);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); 
  const [confirmMessage, setConfirmMessage] = useState(''); 

  const handleAddNote = () => {
    setEditingNote(undefined);
    setIsModalOpen(true);
  };

  const handleEditNote = (note: { id: number; author: string; category: string; notes: string }) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleAddCategory = () => {
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = () => {
    if (newCategoryName.trim()) {
      setCategories((prevCategories) => [...prevCategories, newCategoryName]);
      setNewCategoryName('');
      setIsCategoryModalOpen(false);
    } else {
      setConfirmMessage('El nombre de la categoría no puede estar vacío.');
      setIsConfirmModalOpen(true); 
    }
  };

  const handleConfirm = () => {
    setIsConfirmModalOpen(false); 
  };

  const handleCancel = () => {
    setIsConfirmModalOpen(false);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <NotesProvider>
        <Navbar />
        <div className="button-container">
          <Tooltip title="Añadir Nota" arrow>
            <button className="add-note-button" onClick={handleAddNote}>
              <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
              <span className="material-symbols-outlined">add_notes</span>
            </button>
          </Tooltip>
          <Tooltip title="Añadir Categoría" arrow>
            <button className="add-category-button" onClick={handleAddCategory}>
              <span className="material-symbols-outlined">add_box</span> {/* Icono para agregar categoría */}
            </button>
          </Tooltip>
        </div>
        <CategoryCards categories={categories} onEdit={handleEditNote} setCategories={setCategories} />

        {/* Modal para agregar o editar una nota */}
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content1">
              <NoteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialNote={editingNote}
                categories={categories}
              />
            </div>
          </div>
        )}

        {/* Modal para agregar nueva categoría */}
        {isCategoryModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2>Agregar Nueva Categoría</h2>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Nombre de la nueva categoría"
              />
              <Tooltip title="Guardar Categoría" arrow>
                <button className="save-button" onClick={handleSaveCategory}>
                  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
                  <span className="material-symbols-outlined">save</span> 
                </button>
              </Tooltip>
              <Tooltip title="Cancelar" arrow>
                <button className="cerrar-button" onClick={() => setIsCategoryModalOpen(false)}>
                  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
                  <span className="material-symbols-outlined">cancel</span>
                </button>
              </Tooltip>
            </div>
          </div>
        )}

        {/* Modal de confirmación reutilizado */}
        <ConfirmModal 
          isOpen={isConfirmModalOpen} 
          message={confirmMessage} 
          onConfirm={handleConfirm} 
          onCancel={handleCancel} 
        />
      </NotesProvider>
    </DndProvider>
  );
};

export default NoteEditor;
