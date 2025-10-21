import React, { useState, useEffect } from "react";
import UnlockForm from "./components/UnlockForm";
import CouponCard from "./components/CouponCard";
import Modal from "./components/Modal";
import Toast from "./components/Toast";

function App() {
  const [isUnlocked, setIsUnlocked] = useState(() => {
    // Check localStorage on app load
    return localStorage.getItem("annivAppUnlocked") === "true";
  });
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Load coupons when unlocked
  useEffect(() => {
    if (isUnlocked) {
      loadCoupons();
    }
  }, [isUnlocked]);

  const loadCoupons = async () => {
    setLoading(true);
    setError("");
    try {
      // For development: simulate API call
      const isDevelopment = import.meta.env.DEV;

      if (isDevelopment) {
        // Simulate coupons data for development
        const mockCoupons = [
          {
            id: "massatge-relaxant",
            name: "Massatge relaxant",
            description: "Sessió de massatge de 45 minuts amb música suau.",
            used: false,
            used_at: null,
            redeemed_by: null,
          },
          {
            id: "sopar-especial",
            name: "Sopar especial",
            description: "Sopar al teu restaurant preferit (tu tries el lloc).",
            used: false,
            used_at: null,
            redeemed_by: null,
          },
          {
            id: "esmorzar-al-llit",
            name: "Esmorzar al llit",
            description: "Esmorzar casolà amb cafè/te i fruita.",
            used: false,
            used_at: null,
            redeemed_by: null,
          },
          {
            id: "picnic-sorpresa",
            name: "Pícnic sorpresa",
            description: "Manta, snacks i passeig amb fotos boniques.",
            used: false,
            used_at: null,
            redeemed_by: null,
          },
          {
            id: "nit-sushi-vi",
            name: "Nit de sushi i vi",
            description: "Sushi variat i copa de vi, estil chill.",
            used: false,
            used_at: null,
            redeemed_by: null,
          },
          {
            id: "sortida-del-sol",
            name: "Sortida del sol",
            description: "Matinar per veure la sortida del sol junts.",
            used: false,
            used_at: null,
            redeemed_by: null,
          },
          {
            id: "escapada-espontania",
            name: "Escapada espontània",
            description: "Mini-escapada d'un dia, destí sorpresa.",
            used: false,
            used_at: null,
            redeemed_by: null,
          },
          {
            id: "dia-improvisacio",
            name: "Dia d'improvisació",
            description: "Sense plans, només improvisar i gaudir.",
            used: false,
            used_at: null,
            redeemed_by: null,
          },
          {
            id: "tarda-platja-muntanya",
            name: "Tarda de platja o muntanya",
            description: "Passeig, bany o ruta senzilla.",
            used: false,
            used_at: null,
            redeemed_by: null,
          },
          {
            id: "sessio-jocs",
            name: "Sessió de jocs",
            description: "Jocs de taula o videojocs cooperatius.",
            used: false,
            used_at: null,
            redeemed_by: null,
          },
        ];

        setTimeout(() => {
          setCoupons(mockCoupons);
          setLoading(false);
        }, 1000);
        return;
      }

      // Production: real API call
      const response = await fetch("/api/coupons");
      if (!response.ok) {
        throw new Error("Error carregant els cupons");
      }
      const data = await response.json();
      setCoupons(data);
    } catch (err) {
      setError("Hi ha hagut un error. Torna-ho a intentar en uns instants.");
      console.error("Error loading coupons:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = (success) => {
    setIsUnlocked(success);
    if (success) {
      setError("");
      // Save to localStorage
      localStorage.setItem("annivAppUnlocked", "true");
    }
  };

  const handleRedeem = async (couponId, customDateTime = null) => {
    try {
      // For development: simulate API call
      const isDevelopment = import.meta.env.DEV;

      if (isDevelopment) {
        // Simulate redeem for development
        const coupon = coupons.find((c) => c.id === couponId);
        if (!coupon) return;

        if (coupon.used) {
          setToast({
            type: "error",
            title: "Cupó ja utilitzat",
            message: "Aquest cupó ja ha estat canjeat.",
          });
          return;
        }

        // Simulate successful redeem
        const now = customDateTime || new Date().toISOString();
        const formattedDate = new Intl.DateTimeFormat("ca-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Europe/Madrid",
        }).format(new Date(now));

        // Update local state
        setCoupons((prev) =>
          prev.map((c) =>
            c.id === couponId
              ? {
                  ...c,
                  used: true,
                  used_at: now,
                  redeemed_by: "Tuxi",
                }
              : c
          )
        );

        // Show success toast
        setToast({
          type: "success",
          title: "S'ha canjeat el cupó ✅",
          message: `Has canjeat «${coupon.name}» el ${formattedDate}.`,
        });

        // Show confetti
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        return;
      }

      // Production: real API call
      const response = await fetch("/api/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: couponId }),
      });

      const data = await response.json();

      if (response.status === 409) {
        setToast({
          type: "error",
          title: "Cupó ja utilitzat",
          message: "Aquest cupó ja ha estat canjeat.",
        });
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Error bescanviant el cupó");
      }

      // Update local state
      setCoupons((prev) =>
        prev.map((coupon) =>
          coupon.id === couponId
            ? {
                ...coupon,
                used: true,
                used_at: data.used_at,
                redeemed_by: data.redeemed_by,
              }
            : coupon
        )
      );

      // Show success toast with formatted date
      const formattedDate = new Intl.DateTimeFormat("ca-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Madrid",
      }).format(new Date(data.used_at));

      setToast({
        type: "success",
        title: "S'ha canjeat el cupó ✅",
        message: `Has canjeat «${data.name}» el ${formattedDate}.`,
      });

      // Show confetti
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (err) {
      setToast({
        type: "error",
        title: "Error",
        message: "Hi ha hagut un error. Torna-ho a intentar en uns instants.",
      });
      console.error("Error redeeming coupon:", err);
    }
  };

  const handleToastClose = () => {
    setToast(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("annivAppUnlocked");
    setIsUnlocked(false);
    setCoupons([]);
  };

  const createConfetti = () => {
    const colors = [
      "#ff6b9d",
      "#a55eea",
      "#74b9ff",
      "#00d4aa",
      "#fdcb6e",
      "#ff7675",
    ];
    const confettiContainer = document.createElement("div");
    confettiContainer.className = "confetti";
    document.body.appendChild(confettiContainer);

    for (let i = 0; i < 80; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      piece.style.left = Math.random() * 100 + "%";
      piece.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = Math.random() * 3 + "s";
      piece.style.animationDuration = Math.random() * 2 + 2 + "s";
      piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";
      confettiContainer.appendChild(piece);
    }

    setTimeout(() => {
      document.body.removeChild(confettiContainer);
    }, 5000);
  };

  useEffect(() => {
    if (showConfetti) {
      createConfetti();
    }
  }, [showConfetti]);

  if (!isUnlocked) {
    return (
      <div className="app">
        <div className="unlock-container">
          <h1 className="unlock-title">🎀 Feliç aniversari</h1>
          <p className="unlock-subtitle">
            Escriu la teua data de naixement per entrar
          </p>
          <UnlockForm onUnlock={handleUnlock} />
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="coupons-container">
        <div className="coupons-header">
          <div className="header-top">
            <h1 className="coupons-title">🎁 Cupons d'aniversari TUXI</h1>
            <button
              className="logout-btn"
              onClick={handleLogout}
              title="Tancar sessió"
            >
              🚪
            </button>
          </div>
          <p className="coupons-subtitle">
            Tria un cupó i gaudeix-lo quan vulguis ✨
          </p>
        </div>

        {loading ? (
          <div className="loading">Carregant cupons...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="coupons-grid">
            {coupons.map((coupon) => (
              <CouponCard
                key={coupon.id}
                coupon={coupon}
                onRedeem={handleRedeem}
              />
            ))}
          </div>
        )}
      </div>

      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={handleToastClose}
        />
      )}
    </div>
  );
}

export default App;
