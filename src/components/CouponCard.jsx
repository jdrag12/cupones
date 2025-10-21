import React, { useState } from "react";
import Modal from "./Modal";

function CouponCard({ coupon, onRedeem }) {
  const [showModal, setShowModal] = useState(false);

  const handleRedeemClick = () => {
    if (coupon.used) {
      return;
    }
    setShowModal(true);
  };

  const handleConfirmRedeem = () => {
    setShowModal(false);
    onRedeem(coupon.id);
  };

  const getConditionsText = (couponName) => {
    const conditions = {
      "Massatge relaxant":
        "Vàlid per a una sessió de 45 minuts. Reserva prèvia necessària.",
      "Sopar especial": "Vàlid per a dues persones. Reserva prèvia necessària.",
      "Esmorzar al llit":
        "Vàlid per a un esmorzar casolà. Inclou cafè/te i fruita.",
      "Pícnic sorpresa":
        "Inclou manta, snacks i passeig amb fotos. Depèn del temps.",
      "Nit de sushi i vi":
        "Vàlid per a dues persones. Inclou sushi variat i una copa de vi.",
      "Sortida del sol":
        "Matinar per veure la sortida del sol junts. Depèn del temps.",
      "Escapada espontània":
        "Mini-escapada d'un dia. Destí sorpresa. Transport no inclòs.",
      "Dia d'improvisació":
        "Sense plans preestablerts. Només improvisar i gaudir.",
      "Tarda de platja o muntanya":
        "Passeig, bany o ruta senzilla. Depèn del temps.",
      "Sessió de jocs":
        "Jocs de taula o videojocs cooperatius. Durada flexible.",
    };
    return conditions[couponName] || "Condicions especials aplicables.";
  };

  return (
    <>
      <div className={`coupon-card ${coupon.used ? "used" : ""}`}>
        <div className="coupon-header">
          <h3 className="coupon-title">{coupon.name}</h3>
          {coupon.used && <span className="coupon-badge">Usat</span>}
        </div>

        <p className="coupon-description">{coupon.description}</p>

        <div className="coupon-footer">
          <button
            type="button"
            className="conditions-link"
            onClick={() => setShowModal(true)}
          >
            Condicions
          </button>

          <button
            className={`btn ${coupon.used ? "btn-secondary" : "btn-primary"}`}
            onClick={handleRedeemClick}
            disabled={coupon.used}
          >
            {coupon.used ? "Usat" : "Canvia"}
          </button>
        </div>
      </div>

      {showModal && (
        <Modal
          title={coupon.used ? "Cupó ja utilitzat" : "Confirmar canvi"}
          onClose={() => setShowModal(false)}
        >
          {coupon.used ? (
            <div>
              <p>Aquest cupó ja ha estat canjeat.</p>
              <p>Si tens alguna pregunta, contacta amb mi.</p>
            </div>
          ) : (
            <div>
              <p>
                <strong>{coupon.name}</strong>
              </p>
              <p>{coupon.description}</p>
              <br />
              <p>
                <strong>Condicions:</strong>
              </p>
              <p>{getConditionsText(coupon.name)}</p>
              <br />
              <p>Estàs segur que vols canviar aquest cupó?</p>
            </div>
          )}

          <div className="modal-actions">
            <button
              className="btn btn-secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel·lar
            </button>
            {!coupon.used && (
              <button className="btn btn-primary" onClick={handleConfirmRedeem}>
                Sí, canvia-ho
              </button>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}

export default CouponCard;

