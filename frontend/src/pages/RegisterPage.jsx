import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "../components/AuthForm";

export const RegisterPage = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async ({ username, password }) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Erro no registro");

      alert("Conta criada com sucesso! Faça login.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <AuthForm type="register" onSubmit={handleRegister} error={error} />
      <p style={{ textAlign: "center", color: "#aaa" }}>
        Já tem conta?{" "}
        <a href="/login" style={{ color: "#ff5500" }}>
          Faça login
        </a>
      </p>
    </div>
  );
};
