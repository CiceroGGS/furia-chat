import { useState } from "react";
import styled from "styled-components";

const FormContainer = styled.div`
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: #1e1e1e;
  border-radius: 8px;
  border: 1px solid #ff5500;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #333;
  background: #2a2a2a;
  color: white;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 12px;
  background: #ff5500;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #e04b00;
  }
`;

const ErrorMessage = styled.p`
  color: #ff3333;
  font-size: 0.9rem;
`;

export const AuthForm = ({ type, onSubmit, error, loading }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <FormContainer>
      <h2>{type === "login" ? "Login" : "Registrar"}</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ username, password });
        }}
      >
        <Input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading
            ? "Carregando..."
            : type === "login"
            ? "Entrar"
            : "Criar conta"}
        </Button>
      </Form>
    </FormContainer>
  );
};
