"use client";

import { useState, useEffect } from "react";

const CookieConsent = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowPopup(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "true");
    setShowPopup(false);
  };

  const handleMinimize = () => {
    setMinimized(true);
  };

  const handleExpand = () => {
    setMinimized(false);
  };

  if (!showPopup) {
    return null;
  }

  return (
    <div className="cookie-consent fade-in">
      {!minimized ? (
        <div className="cookie-popup">
          <p>We use cookies to enhance your experience. By continuing, you agree to our use of cookies.</p>
          <a onClick={handleAccept} className="cookie-accept">
            Accept
          </a>
          <a onClick={handleMinimize} className="cookie-close">
            Close
          </a>
        </div>
      ) : (
        <div className="cookie-mini" onClick={handleExpand}>
          🍪
        </div>
      )}
    </div>
  );
};

export default CookieConsent;
