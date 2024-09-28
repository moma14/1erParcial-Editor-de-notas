 import React, { createContext, useReducer, useContext, ReactNode } from 'react';

// esta es la definición de la interfaz para las notas
interface Note {
  id: number;
  author: string;
  category: string;
  notes: string;
}

type Action =
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'EDIT_NOTE'; payload: Note }
  | { type: 'DELETE_NOTE'; payload: number };

interface NotesContextType {
  notes: Note[];
  dispatch: React.Dispatch<Action>;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

const notesReducer = (state: Note[], action: Action): Note[] => {
  switch (action.type) {
    case 'ADD_NOTE':
      return [...state, action.payload];
    case 'EDIT_NOTE':
      return state.map(note => note.id === action.payload.id ? action.payload : note);
    case 'DELETE_NOTE':
      return state.filter(note => note.id !== action.payload);
    default:
      return state;
  }
};

interface NotesProviderProps {
  children: ReactNode;
}

export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
  const [notes, dispatch] = useReducer(notesReducer, []);

  return (
    <NotesContext.Provider value={{ notes, dispatch }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = (): NotesContextType => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes debe usarse dentro de un NotesProvider');
  }
  return context;
};
