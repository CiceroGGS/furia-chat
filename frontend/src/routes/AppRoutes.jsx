import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "../pages/LoginPage"; // Ajuste o caminho se necessário
import RegisterPage from "../pages/RegisterPage"; // Ajuste o caminho se necessário
import App from "../App"; // O seu componente principal do chat

const AppRoutes = () => {
  const authToken = localStorage.getItem("authToken");

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/chat"
          element={authToken ? <App /> : <Navigate to="/login" replace />}
        />
        <Route path="/" element={<Navigate to="/chat" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
