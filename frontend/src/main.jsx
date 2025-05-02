// frontend/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./routes/AppRoutes"; // Verifique se o caminho para AppRoutes está correto
import "./index.css"; // Ou o seu arquivo de estilos global (se existir)

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>
);
