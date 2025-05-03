import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { AuthForm } from "../components/AuthForm";
import styled from "styled-components";

const AuthPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  padding: 20px;
  background: linear-gradient(135deg, #0a0a0a, #1a1a1a);
`;

const AuthLinkText = styled.p`
  margin-top: 1.5rem;
  color: #b0b0b0;
  text-align: center;
`;

const AuthLink = styled(Link)`
  color: #ff5500;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    color: #ff884d;
    text-decoration: underline;
  }
`;

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
    <AuthPageContainer>
      <AuthForm
        type="login"
        onSubmit={handleLogin}
        error={error}
        loading={isLoading}
      />
      <AuthLinkText>
        Não tem conta? <AuthLink to="/register">Registre-se</AuthLink>
      </AuthLinkText>
    </AuthPageContainer>
  );
};
