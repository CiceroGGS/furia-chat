import { useState } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const gradient = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  padding: 20px;
  background: linear-gradient(135deg, #0a0a0a, #1a1a1a);
`;

const FormContainer = styled.div`
  max-width: 400px;
  width: 100%;
  padding: 2.5rem;
  background: rgba(30, 30, 30, 0.8);
  border-radius: 16px;
  border: 1px solid rgba(255, 85, 0, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  animation: ${fadeIn} 0.6s ease-out forwards;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #ff5500, #ff9900, #ff5500);
    background-size: 200% 200%;
    animation: ${gradient} 3s ease infinite;
    z-index: -1;
    filter: blur(5px);
    opacity: 0.7;
  }
`;

const FormTitle = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: white;
  font-size: 1.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;

  &::after {
    content: "";
    display: block;
    width: 60px;
    height: 3px;
    background: linear-gradient(to right, #ff5500, #ff9900);
    margin: 0.5rem auto 0;
    border-radius: 3px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputField = styled.input`
  padding: 1rem 1.5rem;
  background: rgba(30, 30, 30, 0.7);
  border: 1px solid rgba(255, 85, 0, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  font-family: "Poppins", sans-serif;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #ff5500;
    box-shadow: 0 0 0 2px rgba(255, 85, 0, 0.2);
  }

  &::placeholder {
    color: #888;
    font-weight: 300;
  }
`;

const SubmitButton = styled.button`
  padding: 1rem;
  background: linear-gradient(135deg, #ff5500, #e04b00);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 1rem;
  margin-top: 0.5rem;
  position: relative;
  overflow: hidden;

  &:hover {
    background: linear-gradient(135deg, #ff6600, #f05000);
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(255, 85, 0, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to bottom right,
      rgba(255, 255, 255, 0.3) 0%,
      rgba(255, 255, 255, 0) 60%
    );
    transform: rotate(30deg);
    transition: all 0.3s ease;
    opacity: 0;
  }

  &:hover::after {
    opacity: 1;
    transform: rotate(30deg) translate(10%, 10%);
  }
`;

const ErrorMessage = styled.p`
  color: #ff3333;
  font-size: 0.9rem;
  text-align: center;
  padding: 0.8rem;
  background: rgba(255, 51, 51, 0.1);
  border-radius: 6px;
  border-left: 3px solid #ff3333;
  animation: ${fadeIn} 0.3s ease-out;
`;

const LoadingIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;

  span {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: white;
    animation: bounce 1.4s infinite ease-in-out;

    &:nth-child(1) {
      animation-delay: -0.32s;
    }

    &:nth-child(2) {
      animation-delay: -0.16s;
    }
  }

  @keyframes bounce {
    0%,
    80%,
    100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
`;

const AuthNavigation = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: #b0b0b0;
  font-size: 0.9rem;
`;

const NavLink = styled(Link)`
  color: #ff5500;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-left: 0.3rem;

  &:hover {
    color: #ff884d;
    text-decoration: underline;
  }
`;

export const AuthForm = ({ type, onSubmit, error, loading }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <AuthContainer>
      <FormContainer>
        <FormTitle>{type === "login" ? "Login" : "Registrar"}</FormTitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({ username, password });
          }}
        >
          <InputField
            type="text"
            placeholder="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <InputField
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <SubmitButton type="submit" disabled={loading}>
            {loading ? (
              <LoadingIndicator>
                <span></span>
                <span></span>
                <span></span>
              </LoadingIndicator>
            ) : type === "login" ? (
              "Entrar"
            ) : (
              "Criar conta"
            )}
          </SubmitButton>
        </Form>

        <AuthNavigation>
          {type === "login" ? (
            <>
              Não tem conta? <NavLink to="/register">Registre-se</NavLink>
            </>
          ) : (
            <>
              Já tem conta? <NavLink to="/login">Faça login</NavLink>
            </>
          )}
        </AuthNavigation>
      </FormContainer>
    </AuthContainer>
  );
};
