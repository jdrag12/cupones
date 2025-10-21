import React, { useState } from "react";

function UnlockForm({ onUnlock }) {
  const [birthday, setBirthday] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!birthday.trim()) return;

    setLoading(true);
    try {
      // For development: simulate API call
      const isDevelopment = import.meta.env.DEV;

      if (isDevelopment) {
        // Simulate API response for development
        const expectedBirthday = "15/11/2001";
        const isMatch = birthday === expectedBirthday;

        setTimeout(() => {
          if (isMatch) {
            onUnlock(true);
          } else {
            onUnlock(false);
          }
          setLoading(false);
        }, 1000);
        return;
      }

      // Production: real API call
      const response = await fetch(
        `/api/unlock?d=${encodeURIComponent(birthday)}`
      );
      const data = await response.json();

      if (response.ok && data.success) {
        onUnlock(true);
      } else {
        onUnlock(false);
      }
    } catch (error) {
      console.error("Error checking birthday:", error);
      onUnlock(false);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    let value = e.target.value;

    // Allow empty input
    if (value === "") {
      setBirthday("");
      return;
    }

    // Auto-format DD/MM/YYYY as user types
    value = value.replace(/\D/g, ""); // Remove non-digits

    if (value.length >= 2) {
      value = value.substring(0, 2) + "/" + value.substring(2);
    }
    if (value.length >= 5) {
      value = value.substring(0, 5) + "/" + value.substring(5, 9);
    }

    setBirthday(value);
  };

  const handleKeyDown = (e) => {
    // Allow backspace, delete, arrow keys, tab, slash, and home/end
    if (
      [8, 9, 27, 46, 37, 38, 39, 40, 35, 36, 191].indexOf(e.keyCode) !== -1 ||
      // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true)
    ) {
      return;
    }
    // Ensure that it is a number and stop the keypress
    if (
      (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
      e.preventDefault();
    }
  };

  return (
    <form className="unlock-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          className="form-input"
          placeholder="DD/MM/AAAA"
          value={birthday}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          maxLength="10"
          disabled={loading}
          required
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading || !birthday.trim()}
      >
        {loading ? "Comprovant..." : "Desbloqueja"}
      </button>
    </form>
  );
}

export default UnlockForm;
