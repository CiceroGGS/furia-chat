import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { AuthForm } from "../components/AuthForm";

export const LoginPage = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async ({ username, password }) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Credenciais inválidas");
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("chatUsername", data.username);
      login(data.token, data.username);

      navigate("/chat");
    } catch (err) {
      setError(err.message || "Erro na conexão com o servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <AuthForm
        type="login"
        onSubmit={handleLogin}
        error={error}
        loading={isLoading}
      />
      <p className="auth-link-text">
        Não tem conta?{" "}
        <Link to="/register" className="auth-link">
          Registre-se
        </Link>
      </p>
    </div>
  );
};
