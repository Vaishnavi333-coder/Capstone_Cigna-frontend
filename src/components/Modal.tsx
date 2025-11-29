import React from 'react';
import './Modal.css';

export default function Modal({ children, onClose }: { children: React.ReactNode; onClose?: () => void }) {
  return (
    <div className="custom-modal">
      <div className="custom-backdrop" onClick={() => onClose && onClose()} />
      <div className="custom-modal-content">
        <div className="custom-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
