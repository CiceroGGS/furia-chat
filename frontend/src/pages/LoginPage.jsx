// frontend/src/pages/LoginPage.jsx
import React, { useEffect } from "react";
import LoginForm from "../components/LoginForm";
import { useNavigate, Link } from "react-router-dom";
import styles from "../modules/LoginPage.module.css"; // Importe os estilos do módulo

function LoginPage() {
  const navigate = useNavigate();

  // Função para verificar se o usuário já está logado
  const checkIfLoggedIn = () => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      navigate("/chat"); // Redireciona para a página do chat se já estiver logado
    }
  };

  useEffect(() => {
    checkIfLoggedIn();
  }, [navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h2>Login</h2>
        <LoginForm />
        <p className={styles.registerText}>
          Não tem uma conta?{" "}
          <Link to="/register" className={styles.registerLink}>
            Registre-se
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
