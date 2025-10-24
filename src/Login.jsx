import { useState } from "react";

const Login = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("isAuthenticated", "true");
      // Redireciona manualmente
      window.location.href = "/home";
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center p-4">
      <div className="bg-blue-400 rounded-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-white mb-2">
          Welcome
        </h1>
        <h2 className="text-xl text-center text-white mb-8">Login</h2>

        <div className="space-y-4">
          <div>
            <label className="text-white">E-mail</label>
            <input
              type="email"
              placeholder="usuario@example.com"
              className="w-full p-3 rounded-lg mt-1"
            />
          </div>

          <div>
            <label className="text-white">Senha</label>
            <input
              type="password"
              placeholder="senha123"
              className="w-full p-3 rounded-lg mt-1"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg text-lg font-semibold mt-4 hover:bg-blue-700"
          >
            {loading ? "Carregando..." : "Enter"}
          </button>
        </div>

        <div className="my-8 border-t border-blue-300"></div>

        <div className="text-center">
          <p className="text-white text-sm mb-2">Credentials para teste:</p>
          <p className="text-white text-xs">
            Email: usuario@example.com
            <br />
            Senha: senha123
          </p>
        </div>

        <div className="mt-8 text-center">
          <p className="text-white text-xs">Clear move usuario</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
