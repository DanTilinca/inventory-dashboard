import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { initThemeFromStorage } from "./components/ThemeToggle";

initThemeFromStorage();

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  `http://localhost:${import.meta.env.VITE_API_PORT || "4000"}`;

if (typeof window !== "undefined" && typeof window.fetch === "function") {
  const originalFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    if (typeof input === "string" && input.startsWith("http://localhost:4000")) {
      const normalizedInput = input.replace("http://localhost:4000", API_BASE_URL);
      return originalFetch(normalizedInput, init);
    }

    return originalFetch(input, init);
  };
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
