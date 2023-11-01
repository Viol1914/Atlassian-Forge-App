// Arquivo: Modal.js
import React from 'react';

const Modal = ({ children, onClose }) => {
    return (
        <div className="modal-background">
            <div className="modal">
                <button onClick={onClose}>Fechar</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
