import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
    <AuthPageContainer>
      <AuthForm type="register" onSubmit={handleRegister} error={error} />
      <AuthLinkText>
        Já tem conta? <AuthLink to="/login">Faça login</AuthLink>
      </AuthLinkText>
    </AuthPageContainer>
  );
};
