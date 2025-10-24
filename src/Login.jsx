import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <div className="page-root">
      {/* Header */}
      <header className="top-header">
        <div className="brand">
          <img src="/src/assets/react.svg" alt="logo" className="logo" />
          <h1 className="brand-title">React Store</h1>
        </div>
      </header>

      {/* Conteúdo centralizado */}
      <main className="login-container">
        <div className="card login-card">
          <h2 className="card-title">Entrar</h2>

          <form onSubmit={handleSubmit} className="form">
            <input
              className="input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="input"
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />

            <div className="form-actions">
              <button type="submit" className="btn primary">
                Entrar
              </button>
              <button
                type="button"
                className="btn ghost"
                onClick={() => {
                  setEmail("");
                  setSenha("");
                }}
              >
                Limpar
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bottom-footer">© 2025 React Store</footer>
    </div>
  );
}
