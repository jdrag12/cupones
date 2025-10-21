import React, { useEffect } from "react";

function Toast({ type, title, message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-close after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${type}`}>
      <div className="toast-title">{title}</div>
      <div className="toast-message">{message}</div>
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "0.5rem",
          right: "0.5rem",
          background: "none",
          border: "none",
          fontSize: "1.2rem",
          cursor: "pointer",
          color: "var(--text-muted)",
          padding: "0.25rem",
        }}
        aria-label="Tancar"
      >
        ×
      </button>
    </div>
  );
}

export default Toast;

