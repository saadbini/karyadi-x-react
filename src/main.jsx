import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import { ParallaxProvider } from 'react-scroll-parallax';
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ParallaxProvider>
          <App />
        </ParallaxProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
