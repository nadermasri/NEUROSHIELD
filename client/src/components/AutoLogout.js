// client/src/components/AutoLogout.js
import { useEffect } from "react";

const AutoLogout = () => {
  useEffect(() => {
    const expiry = localStorage.getItem("tokenExpiry");
    if (expiry) {
      const timeout = +expiry - Date.now();

      if (timeout > 0) {
        const timer = setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("tokenExpiry");
          window.location.href = "/login";
        }, timeout);

        return () => clearTimeout(timer);
      } else {
        // Token already expired
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiry");
        window.location.href = "/login";
      }
    }
  }, []);

  return null; // This component doesn’t render anything
};

export default AutoLogout;
