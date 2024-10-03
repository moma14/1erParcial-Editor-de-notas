import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
        <div className="modal-content1">
          <h3>{message}</h3>
          <div className="modal-buttons">
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
            <button onClick={onConfirm} className="confirm-button"><span className="material-symbols-outlined">
              check_circle
              </span>
            </button>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
            <button onClick={onCancel} className="cancel-button"><span className="material-symbols-outlined">
              cancel
              </span>
            </button>
          </div>
        </div>
    </div>
  );
};

export default ConfirmModal;
