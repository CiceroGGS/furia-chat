import React from "react";
import RegisterForm from "../components/RegisterForm";
import { Link } from "react-router-dom";

function RegisterPage() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f0f0",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2>Registro</h2>
        <RegisterForm />
        <p style={{ marginTop: "10px", fontSize: "0.9em", color: "gray" }}>
          Já tem uma conta?{" "}
          <Link
            to="/login"
            style={{ color: "#007bff", textDecoration: "none" }}
          >
            Faça Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
