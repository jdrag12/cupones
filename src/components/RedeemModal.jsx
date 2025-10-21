import { useState } from "react";

const RedeemModal = ({ isOpen, onClose, onConfirm, couponName }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const handleDateChange = (e) => {
    let value = e.target.value;

    // Auto-format DD/MM/YYYY as user types
    value = value.replace(/\D/g, ""); // Remove non-digits

    if (value.length >= 2) {
      value = value.substring(0, 2) + "/" + value.substring(2);
    }
    if (value.length >= 5) {
      value = value.substring(0, 5) + "/" + value.substring(5, 9);
    }

    setSelectedDate(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedDate && selectedTime) {
      // Convert DD/MM/YYYY to YYYY-MM-DD for Date constructor
      const [day, month, year] = selectedDate.split("/");
      const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}`;
      const dateTime = new Date(`${formattedDate}T${selectedTime}`);
      onConfirm(dateTime.toISOString());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">🎁 Bescanviar Cupó</h2>
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
              type="text"
              id="date"
              className="form-input"
              placeholder="DD/MM/YYYY"
              value={selectedDate}
              onChange={handleDateChange}
              maxLength="10"
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
              Bescanviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RedeemModal;
