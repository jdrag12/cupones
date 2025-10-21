import { useState } from "react";

const RedeemModal = ({ isOpen, onClose, onConfirm, couponName }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedDate && selectedTime) {
      const dateTime = new Date(`${selectedDate}T${selectedTime}`);
      onConfirm(dateTime.toISOString());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">🎁 Canjear Cupó</h2>
        </div>

        <div className="modal-content">
          <p>
            <strong>Cupó:</strong> {couponName}
          </p>
          <p>Selecciona el día y la hora per a aquest cupó:</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="date" className="form-label">
              📅 Dia
            </label>
            <input
              type="date"
              id="date"
              className="form-input"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="time" className="form-label">
              🕐 Hora
            </label>
            <input
              type="time"
              id="time"
              className="form-input"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              required
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel·lar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!selectedDate || !selectedTime}
            >
              Canjear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RedeemModal;
