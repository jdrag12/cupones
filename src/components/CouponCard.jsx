import React, { useState } from "react";
import RedeemModal from "./RedeemModal";

function CouponCard({ coupon, onRedeem }) {
  const [showRedeemModal, setShowRedeemModal] = useState(false);

  const handleRedeemClick = () => {
    if (coupon.used) {
      return;
    }
    setShowRedeemModal(true);
  };

  const handleRedeemConfirm = (dateTime) => {
    onRedeem(coupon.id, dateTime);
    setShowRedeemModal(false);
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
            className="btn btn-primary"
            onClick={handleRedeemClick}
            disabled={coupon.used}
          >
            Bescanvia
          </button>
        </div>
      </div>

      {showRedeemModal && (
        <RedeemModal
          isOpen={showRedeemModal}
          onClose={() => setShowRedeemModal(false)}
          onConfirm={handleRedeemConfirm}
          couponName={coupon.name}
        />
      )}
    </>
  );
}

export default CouponCard;
