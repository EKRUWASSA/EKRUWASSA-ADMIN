import React from "react";
import "./Modal.css"; // Import modal-specific styles

const Modal = ({ show, onClose, children, className = "" }) => {
  if (!show) return null;

  return (
    <div className={`modal-overlay ${className}`} onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Prevents closing the modal when clicking inside
      >
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
